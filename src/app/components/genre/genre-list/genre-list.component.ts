import { Component, ViewChild } from '@angular/core';
import { Genre } from '../../../models/genre/genre.model';
import { GenreService } from '../../../_service/genre/genre.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { CommonModule } from '@angular/common';
import { GenreFormComponent } from '../genre-form/genre-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { GenreSearchComponent } from '../genre-search/genre-search.component';


@Component({
  selector: 'app-genre-list',
  imports: [ModalComponent, CommonModule, GenreFormComponent, FormsModule, PaginationComponent, GenreSearchComponent],
  templateUrl: './genre-list.component.html',
  styleUrl: './genre-list.component.css'
})
export class GenreListComponent {

  // Search
  searchQuery: string = '';

  // Pagination
  pageSize: number = 10;
  currentPage: number = 0;
  totalPages: number = 0;
  genres: any[] = [];

  // Delete modal
  genreToDelete: number | null = null; 
  @ViewChild('deleteModal') deleteModal!: ModalComponent;

  // Update mdoal
  showFormModal = false;
  genreToUpdate:  Genre = { id: 0, name: '' };
  @ViewChild(GenreFormComponent) formModal!: GenreFormComponent;

  constructor(
      private genreService: GenreService
  ) {
  }

  ngOnInit(): void {
    this.getAllGenres();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getAllGenres(page);
  }
  
  getAllGenres(page: number = 0) {
    this.genreService.getAllSearchPaginated(this.searchQuery, page, this.pageSize).subscribe({
      next: (response) => {
        if (response && response.content && response.totalPages !== undefined) {
          this.genres = response.content;
          this.totalPages = response.totalPages;
        }
      },
      error: (err) => {
        console.error('Error fetching genres:', err);
      },
    });
  }

  prepareDeleteConfirmation(id: number): void {
    this.genreToDelete = id;
    this.deleteModal.title = 'Delete Genre';
    this.deleteModal.message = 'Are you sure you want to delete this genre?';
    this.deleteModal.confirmButtonText = 'Delete';
    this.deleteModal.cancelButtonText = 'Cancel';
    this.deleteModal.type = 'danger';
  }

  prepareDeleteSuccess() {
    this.deleteModal.title = 'Genre Deleted';
    this.deleteModal.message = 'The genre has been successfully deleted.';
    this.deleteModal.type = 'info';
    this.deleteModal.confirmButtonText = '';
    this.deleteModal.cancelButtonText = 'Accept';
  }

  prepareDeleteError(err: HttpErrorResponse): void {
    if (err.status === 409) {
      this.deleteModal.message = 'This genre cannot be deleted because it is still referenced by books.';
    } else if (err.status === 404) {
      this.deleteModal.message = 'Genre not found.';
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
    this.genreService.delete(id).subscribe({
      next: () => {
          this.genres = this.genres.filter(language => language.id !== id);
          if (this.genres.length < this.pageSize) {
            if (this.currentPage < this.totalPages - 1) {
              this.getAllGenres(this.currentPage + 1);
            } else {
              if (this.currentPage > 0) {
                this.currentPage--;
                this.getAllGenres(this.currentPage);
              }
            }
          } else {
            this.getAllGenres(this.currentPage);
          }
          this.deleteModal.closeModal();
      },
      error: (err: HttpErrorResponse) => {
        this.prepareDeleteError(err);
        this.deleteModal.openModal();
      }
    });
  }

  onConfirmForm(updatedGenre: Genre): void {
    const index = this.genres.findIndex(g => g.id === updatedGenre.id);
    if (index !== -1) {
      this.genres[index] = updatedGenre;
    }
    this.formModal.closeModal();
  }

  onConfirmDelete(): void {
    if (this.genreToDelete !== null) {
      this.delete(this.genreToDelete);
    }
  }

  onSearch(query: { [key: string]: string }) {
    this.searchQuery = query['name'] || '';
    this.currentPage = 0;
    this.getAllGenres();
  }
  
  onClearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.getAllGenres();
  }

  openCreateModal(): void {
    this.openFormModal({ id: 0, name: ''});
  }
  
  openEditModal(genre: Genre): void {
    this.openFormModal(genre);
  }

  openFormModal(genre: Genre): void {
    this.genreToUpdate = { ...genre };
    this.showFormModal = true;
    this.formModal.openModal(this.genreToUpdate);
  }

} 