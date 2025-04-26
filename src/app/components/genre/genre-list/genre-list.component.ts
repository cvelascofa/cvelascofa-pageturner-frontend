import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Genre } from '../../../models/genre/genre.model';
import { GenreService } from '../../../_service/genre/genre.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { CommonModule } from '@angular/common';
import { GenreUpdateComponent } from '../genre-update/genre-update.component';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-genre-list',
  imports: [RouterLink, ModalComponent, CommonModule, GenreUpdateComponent],
  templateUrl: './genre-list.component.html',
  styleUrl: './genre-list.component.css'
})
export class GenreListComponent {
  genres: Genre[] = [];

  // Delete modal
  genreToDelete: number | null = null; 
  @ViewChild('deleteModal') deleteModal!: ModalComponent;

  // Update mdoal
  showUpdateModal = false;
  genreToUpdate:  Genre = { id: 0, name: '' };
  @ViewChild(GenreUpdateComponent) updateModal!: GenreUpdateComponent;

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

  openEditModal(genre: Genre): void {
    this.genreToUpdate = { ...genre };
    this.showUpdateModal = true;
    this.updateModal.openModal(this.genreToUpdate);
  }

  delete(id: number): void {
    console.log("delete")
    this.genreService.delete(id).subscribe({
      next: () => {
        this.genres = this.genres.filter(g => g.id !== id);
        this.deleteModal.closeModal();
        this.prepareDeleteSuccess();
        this.deleteModal.openModal();
      },
      error: (err: HttpErrorResponse) => {
        this.prepareDeleteError(err);
        this.deleteModal.openModal();
      }
    });
  }

  onConfirmUpdate(updatedGenre: Genre): void {
    console.log("onConfirmUpdate")
    const index = this.genres.findIndex(g => g.id === updatedGenre.id);
    if (index !== -1) {
      this.genres[index] = updatedGenre;
    }
    this.updateModal.closeModal();
  }

  onConfirmDelete(): void {
    console.log("onConfirmDelete")
    if (this.genreToDelete !== null) {
      this.delete(this.genreToDelete);
    }
  }
} 