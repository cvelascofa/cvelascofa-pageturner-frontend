import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from '../../shared/modal/modal.component';
import { Publisher } from '../../../models/publisher/publisher.model';
import { PublisherFormComponent } from '../publisher-form/publisher-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PublisherService } from '../../../_service/publisher/publisher.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { PublisherSearchComponent } from '../publisher-search/publisher-search.component';

@Component({
  selector: 'app-publisher-list',
  imports: [CommonModule, PaginationComponent, PublisherSearchComponent, PublisherFormComponent, ModalComponent],
  templateUrl: './publisher-list.component.html',
  styleUrl: './publisher-list.component.css'
})
export class PublisherListComponent {
  
  // Search
  searchQuery: string = '';
  
  // Pagination
  pageSize: number = 10;
  currentPage: number = 0;
  totalPages: number = 0;
  publishers: Publisher[] = [];

  // Delete modal
  publisherToDelete: number | null = null; 
  @ViewChild('deleteModal') deleteModal!: ModalComponent;

  // Form modal
  showFormModal = false;
  publisherToUpdate: Publisher = { id: 0, name: '', website: '', country: '' };
  @ViewChild(PublisherFormComponent) formModal!: PublisherFormComponent;

  constructor(private publisherService: PublisherService) {}

  ngOnInit(): void {
    this.getAllPublishers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getAllPublishers(page);
  }

  getAllPublishers(page: number = 0): void {
    this.publisherService.getAllSearchPaginated(this.searchQuery, page, this.pageSize).subscribe({
      next: (response) => {
        if (response && response.content && response.totalPages !== undefined) {
          this.publishers = response.content;
          this.totalPages = response.totalPages;
        }
      },
      error: (err) => {
        console.error('Error fetching publishers:', err);
      }
    });
  }

  prepareDeleteConfirmation(id: number): void {
    this.publisherToDelete = id;
    this.deleteModal.title = 'Delete Publisher';
    this.deleteModal.message = 'Are you sure you want to delete this publisher?';
    this.deleteModal.confirmButtonText = 'Delete';
    this.deleteModal.cancelButtonText = 'Cancel';
    this.deleteModal.type = 'danger';
  }

  prepareDeleteSuccess() {
    this.deleteModal.title = 'Publisher Deleted';
    this.deleteModal.message = 'The publisher has been successfully deleted.';
    this.deleteModal.type = 'info';
    this.deleteModal.confirmButtonText = '';
    this.deleteModal.cancelButtonText = 'Accept';
  }

  prepareDeleteError(err: HttpErrorResponse): void {
    if (err.status === 409) {
      this.deleteModal.message = 'This publisher cannot be deleted because it is still referenced.';
    } else if (err.status === 404) {
      this.deleteModal.message = 'Publisher not found.';
    } else {
      this.deleteModal.message = 'Something went wrong. Please try again.';
    }
  
    this.deleteModal.title = 'Error';
    this.deleteModal.type = 'info';
    this.deleteModal.confirmButtonText = '';
    this.deleteModal.cancelButtonText = 'Accept';
  }

  openDeleteModal(id: number) {
    this.prepareDeleteConfirmation(id);
    this.deleteModal.openModal();
  }

  delete(id: number): void {
    this.publisherService.delete(id).subscribe({
      next: () => {
        this.publishers = this.publishers.filter(publisher => publisher.id !== id);
        if (this.publishers.length < this.pageSize) {
          if (this.currentPage < this.totalPages - 1) {
            this.getAllPublishers(this.currentPage + 1);
          } else {
            if (this.currentPage > 0) {
              this.currentPage--;
              this.getAllPublishers(this.currentPage);
            }
          }
        } else {
          this.getAllPublishers(this.currentPage);
        }
        this.deleteModal.closeModal();
      },
      error: (err: HttpErrorResponse) => {
        this.prepareDeleteError(err);
        this.deleteModal.openModal();
      }
    });
  }

  onConfirmDelete(): void {
    if (this.publisherToDelete !== null) {
      this.delete(this.publisherToDelete);
    }
  }

  openCreateModal(): void {
    this.openFormModal({ id: 0, name: '', website: '', country: '' });
  }
  
  openEditModal(publisher: Publisher): void {
    this.openFormModal(publisher);
  }

  openFormModal(publisher: Publisher): void {
    this.publisherToUpdate = { ...publisher };
    this.showFormModal = true;
    this.formModal.openModal(this.publisherToUpdate);
  }

  onConfirmForm(updatedPublisher: Publisher): void {
    const index = this.publishers.findIndex(p => p.id === updatedPublisher.id);
  
    if (index !== -1) {
      this.handleUpdate(updatedPublisher, index);
    } else {
      this.handleCreate(updatedPublisher);
    }
  
    this.formModal.closeModal();
  }
  
  handleUpdate(updatedPublisher: Publisher, index: number): void {
    this.publishers[index] = updatedPublisher;
  }
  
  handleCreate(newPublisher: Publisher): void {
    const isLastPage = this.currentPage === this.totalPages - 1;
  
    if (isLastPage) {
      if (this.publishers.length < this.pageSize) {
        this.publishers.push(newPublisher);
      } else {
        this.totalPages++;
      }
    } else {
      this.currentPage = 0;
      this.getAllPublishers(0);
    }
  }
  
  onSearch(query: { [key: string]: string }) {
    this.searchQuery = query['name'] || '';
    this.currentPage = 0;
    this.getAllPublishers();
  }
  
  onClearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.getAllPublishers();
  }
}