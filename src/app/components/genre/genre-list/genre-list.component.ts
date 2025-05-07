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
  
  getAllGenres(page: number = 0, callback?: (genres: any[]) => void): void {
    this.genreService.getAllSearchPaginated(this.searchQuery, page, this.pageSize).subscribe({
      next: (response) => {
        if (response && response.content && response.totalPages !== undefined) {
          this.genres = response.content;
          this.totalPages = response.totalPages;
          this.currentPage = response.number;
          if (callback) {
            callback(this.genres);
          }
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
        this.getAllGenres(this.currentPage, (genres: any[]) => {
          if (genres.length === 0 && this.currentPage > 0) {
            this.currentPage--;
            this.getAllGenres(this.currentPage);
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

  onConfirmForm(updatedGenre: Genre): void {
    const index = this.genres.findIndex(g => g.id === updatedGenre.id);
  
    if (index !== -1) {
      this.handleUpdate(updatedGenre, index);
    } else {
      this.handleCreate(updatedGenre);
    }
  
    this.formModal.closeModal();
  }
  
  handleUpdate(updatedGenre: Genre, index: number): void {
    this.genres[index] = updatedGenre;
  }
  
  handleCreate(newGenre: Genre): void {
    const isLastPage = this.currentPage === this.totalPages - 1;
  
    if (isLastPage) {
      if (this.genres.length < this.pageSize) {
        this.genres.push(newGenre);
      } else {
        this.totalPages++;
      }
    } else {
      this.currentPage = 0;
      this.getAllGenres(0);
    }
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