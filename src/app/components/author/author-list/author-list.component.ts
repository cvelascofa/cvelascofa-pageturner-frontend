import { Component, ViewChild } from '@angular/core';
import { Author } from '../../../models/author/author.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalComponent } from '../../shared/modal/modal.component';
import { AuthorService } from '../../../_service/author/author.service';
import { AuthorFormComponent } from '../author-form/author-form.component';
import { AuthorSearchComponent } from '../author-search/author-search.component';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-author-list',
  imports: [AuthorFormComponent, AuthorSearchComponent, ModalComponent, CommonModule, PaginationComponent],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.css'
})
export class AuthorListComponent {
   // Search
   searchQuery: string = '';

   // Pagination
   pageSize: number = 10;
   currentPage: number = 0;
   totalPages: number = 0;
   authors: Author[] = [];
 
   // Delete modal
   authorToDelete: number | null = null;
   @ViewChild('deleteModal') deleteModal!: ModalComponent;
 
   // Update modal
   showFormModal = false;
   authorToUpdate: Author = { 
    id: 0, 
    name: '', 
    bio: '', 
    website: '', 
    followersCount: 0 
  };
   @ViewChild(AuthorFormComponent) formModal!: AuthorFormComponent;
 
   constructor(private authorService: AuthorService) {}
 
   ngOnInit(): void {
     this.getAllAuthors();
   }
 
   onPageChange(page: number): void {
     this.currentPage = page;
     this.getAllAuthors(page);
   }
 
   getAllAuthors(page: number = 0, callback?: (authors: Author[]) => void): void {
    this.authorService.getAllSearchPaginated(this.searchQuery, page, this.pageSize)
      .subscribe({
        next: (response) => {
          if (response?.content && response.totalPages !== undefined) {
            this.authors = response.content;
            this.totalPages = response.totalPages;
  
            if (callback) callback(this.authors);
          }
        },
        error: (err) => {
          console.error('Error fetching authors:', err);
        }
      });
  }
  
 
   prepareDeleteConfirmation(id: number): void {
     this.authorToDelete = id;
     this.deleteModal.title = 'Delete Author';
     this.deleteModal.message = 'Are you sure you want to delete this author?';
     this.deleteModal.confirmButtonText = 'Delete';
     this.deleteModal.cancelButtonText = 'Cancel';
     this.deleteModal.type = 'danger';
   }
 
   prepareDeleteSuccess() {
     this.deleteModal.title = 'Author Deleted';
     this.deleteModal.message = 'The author has been successfully deleted.';
     this.deleteModal.type = 'info';
     this.deleteModal.confirmButtonText = '';
     this.deleteModal.cancelButtonText = 'Accept';
   }
 
   prepareDeleteError(err: HttpErrorResponse): void {
     if (err.status === 409) {
       this.deleteModal.message = 'This author cannot be deleted because it is still referenced by books.';
     } else if (err.status === 404) {
       this.deleteModal.message = 'Author not found.';
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
    this.authorService.delete(id).subscribe({
      next: () => {
        this.getAllAuthors(this.currentPage, (authors: Author[]) => {
          if (authors.length === 0 && this.currentPage > 0) {
            this.currentPage--;
            this.getAllAuthors(this.currentPage);
          }
        });
  
        this.deleteModal.closeModal();
      },
      error: (err: HttpErrorResponse) => {
        this.prepareDeleteError(err);
        this.deleteModal.openModal();
      }
    });
  }
  
 
   onConfirmForm(updatedAuthor: Author): void {
    const index = this.authors.findIndex((a) => a.id === updatedAuthor.id);
  
    if (index !== -1) {
      this.handleUpdate(updatedAuthor, index);
    } else {
      this.handleCreate(updatedAuthor);
    }
  
    this.formModal.closeModal();
  }

  handleUpdate(updatedAuthor: Author, index: number): void {
    this.authors[index] = updatedAuthor;
  }
  
  handleCreate(newAuthor: Author): void {
    const isLastPage = this.currentPage === this.totalPages - 1;
  
    if (isLastPage) {
      if (this.authors.length < this.pageSize) {
        this.authors.push(newAuthor);
      } else {
        this.totalPages++;
      }
    } else {
      this.currentPage = 0;
      this.getAllAuthors(0);
    }
  }
  
 
   onConfirmDelete(): void {
     if (this.authorToDelete !== null) {
       this.delete(this.authorToDelete);
     }
   }
 
   onSearch(query: { [key: string]: string }) {
     this.searchQuery = query['name'] || '';
     this.currentPage = 0;
     this.getAllAuthors();
   }
 
   onClearSearch() {
     this.searchQuery = '';
     this.currentPage = 0;
     this.getAllAuthors();
   }
 
   openCreateModal(): void {
     this.openFormModal({ 
        id: 0, 
        name: '', 
        bio: '', 
        website: '', 
        followersCount: 0 
      });  
   }
 
   openEditModal(author: Author): void {
     this.openFormModal(author);
   }
 
   openFormModal(author: Author): void {
     this.authorToUpdate = { ...author };
     this.showFormModal = true;
     this.formModal.openModal(this.authorToUpdate);
   }

}