import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Genre } from '../../../models/genre/genre.model';
import { GenreService } from '../../../_service/genre/genre.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { CommonModule } from '@angular/common';
import { GenreUpdateComponent } from '../genre-update/genre-update.component';

@Component({
  selector: 'app-genre-list',
  imports: [RouterLink, ModalComponent, CommonModule, GenreUpdateComponent],
  templateUrl: './genre-list.component.html',
  styleUrl: './genre-list.component.css'
})
export class GenreListComponent {
  genres: Genre[] = [];

  // Delete modal
  isModalVisible: boolean = false;
  genreToDelete: number | null = null; 
  @ViewChild('confirmModal') confirmModal!: ModalComponent;

  // Update mdoal
  genreToUpdate:  Genre = { id: 0, name: '' };
  showUpdateModal = false;
  @ViewChild(GenreUpdateComponent) genreUpdateModal!: GenreUpdateComponent;

  constructor(
      private genreService: GenreService
  ) {
  }

  ngOnInit(): void {
    this.getAllGenres();
  }
  
  getAllGenres() {
    this.genreService.getAll().subscribe(genre => {
      this.genres = genre;
    });
  }

  prepareDeleteGenre(id: number): void {
    this.genreToDelete = id;
    this.confirmModal.title = 'Delete Genre';
    this.confirmModal.message = 'Are you sure you want to delete this genre?';
    this.confirmModal.confirmButtonText = 'Delete';
    this.confirmModal.cancelButtonText = 'Cancel';
    this.confirmModal.type = 'danger';

    this.confirmModal.openModal();
  }

  onConfirmDelete(): void {
    if (this.genreToDelete !== null) {
      this.deleteGenre(this.genreToDelete);
    }
  }

  deleteGenre(id: number): void {
    this.genreService.delete(id).subscribe({
      next: () => {
        this.genres = this.genres.filter(g => g.id !== id);
  
        this.confirmModal.closeModal();
  
        this.confirmModal.title = 'Genre Deleted';
        this.confirmModal.message = 'The genre has been successfully deleted.';
        this.confirmModal.type = 'info';
        this.confirmModal.confirmButtonText = '';
        this.confirmModal.cancelButtonText = 'Accept';

        this.confirmModal.openModal();
      },
      error: (err) => {

        if (err.status === 409) {
          this.confirmModal.message = 'This genre cannot be deleted because it is still referenced by books.';
        } 
        else if (err.status === 404) {
          this.confirmModal.message = 'Genre not found.';
        }
        else {
          this.confirmModal.message = 'Something went wrong. Please try again.';
        }

        this.confirmModal.title = 'Error';
        this.confirmModal.type = 'info';
        this.confirmModal.confirmButtonText = '';
        this.confirmModal.cancelButtonText = 'Accept';

        this.confirmModal.openModal();
      }
    });
  }

  openEditModal(genre: Genre): void {
    this.genreToUpdate = { ...genre };
    this.showUpdateModal = true;
    this.genreUpdateModal.openModal(this.genreToUpdate);
  }
  
  closeEditModal(): void {
    this.showUpdateModal = false;
    this.genreToUpdate = { id: 0, name: '' };
  }
  
  onGenreUpdated(updatedGenre: Genre): void {
    const index = this.genres.findIndex(g => g.id === updatedGenre.id);
    if (index !== -1) {
      this.genres[index] = updatedGenre;
    }
    this.closeEditModal();
  }
} 