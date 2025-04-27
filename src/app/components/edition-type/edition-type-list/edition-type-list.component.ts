import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { EditionType } from '../../../models/edition-type/edition-type.model';
import { EditionTypeService } from '../../../_service/edition-type/edition-type.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EditionTypeSearchComponent } from '../edition-type-search/edition-type-search.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edition-type-list',
  imports: [CommonModule, PaginationComponent, ModalComponent, EditionTypeSearchComponent, FormsModule],
  templateUrl: './edition-type-list.component.html',
  styleUrl: './edition-type-list.component.css'
})
export class EditionTypeListComponent {

  // Search
  searchQuery: string = '';

  // Pagination
  pageSize: number = 10;
  currentPage: number = 0;
  totalPages: number = 0;
  editionTypes: any[] = [];

  // Delete modal
  editionTypeToDelete: number | null = null; 
  @ViewChild('deleteModal') deleteModal!: ModalComponent;

  // Update modal
  showFormModal = false;
  editionTypeToUpdate: EditionType = { id: 0, name: '' };
  //@ViewChild(EditionTypeFormComponent) formModal!: EditionTypeFormComponent;

  constructor(
    private editionTypeService: EditionTypeService
  ) {}

  ngOnInit(): void {
    this.getAllEditionTypes();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getAllEditionTypes(page);
  }

  getAllEditionTypes(page: number = 0) {
    this.editionTypeService.getAllSearchPaginated(this.searchQuery, page, this.pageSize).subscribe({
      next: (response) => {
        if (response && response.content && response.totalPages !== undefined) {
          this.editionTypes = response.content;
          this.totalPages = response.totalPages;
        }
      },
      error: (err) => {
        console.error('Error fetching edition types:', err);
      },
    });
  }

  onConfirmDelete(): void {
    if (this.editionTypeToDelete !== null) {
      this.delete(this.editionTypeToDelete);
    }
  }

  delete(id: number): void {
    this.editionTypeService.delete(id).subscribe({
      next: () => {
        this.editionTypes = this.editionTypes.filter(editionType => editionType.id !== id);
        if (this.editionTypes.length < this.pageSize) {
          if (this.currentPage < this.totalPages - 1) {
            this.getAllEditionTypes(this.currentPage + 1);
          } else {
            if (this.currentPage > 0) {
              this.currentPage--;
              this.getAllEditionTypes(this.currentPage);
            }
          }
        } else {
          this.getAllEditionTypes(this.currentPage);
        }
        this.deleteModal.closeModal();
      },
      error: (err: HttpErrorResponse) => {
        this.prepareDeleteError(err);
        this.deleteModal.openModal();
      }
    });
  }

  prepareDeleteConfirmation(id: number): void {
    this.editionTypeToDelete = id;
    this.deleteModal.title = 'Delete Edition Type';
    this.deleteModal.message = 'Are you sure you want to delete this edition type?';
    this.deleteModal.confirmButtonText = 'Delete';
    this.deleteModal.cancelButtonText = 'Cancel';
    this.deleteModal.type = 'danger';
  }

  prepareDeleteSuccess() {
    this.deleteModal.title = 'Edition Type Deleted';
    this.deleteModal.message = 'The edition type has been successfully deleted.';
    this.deleteModal.type = 'info';
    this.deleteModal.confirmButtonText = '';
    this.deleteModal.cancelButtonText = 'Accept';
  }

  prepareDeleteError(err: HttpErrorResponse): void {
    if (err.status === 409) {
      this.deleteModal.message = 'This edition type cannot be deleted because it is still referenced by books.';
    } else if (err.status === 404) {
      this.deleteModal.message = 'Edition type not found.';
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

  onSearch(query: { name: string }) {
    this.searchQuery = query.name || '';
    this.currentPage = 0;
    this.getAllEditionTypes();
  }

  onClearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.getAllEditionTypes();
  }

}