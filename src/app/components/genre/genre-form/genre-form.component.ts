import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Genre } from '../../../models/genre/genre.model';
import { GenreService } from '../../../_service/genre/genre.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-genre-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './genre-form.component.html',
  styleUrl: './genre-form.component.css'
})

export class GenreFormComponent {
  
  isVisible: boolean  = false;
  isEditMode: boolean = false;
  
  @Input() genre: Genre = { id: 0, name: '' };
  
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<Genre>();

  constructor(private genreService: GenreService) { }

  openModal(genre: Genre): void {
    this.genre = { ...genre };
    this.isEditMode = genre.id !== 0;
    this.isVisible = true;
    document.body.classList.add('modal-open');
  }
  
  closeModal(): void {
    this.isVisible = false;
    document.body.classList.remove('modal-open');
  }

  onSubmit(): void {
    this.isEditMode ? this.update() : this.create();
  }


  update(): void {
    this.genreService.update(this.genre).subscribe({
      next: (updatedGenre) => {
        this.confirm.emit(updatedGenre);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating genre:', err);
      }
    });
  }

  create() {
    this.genreService.create(this.genre).subscribe({
      next: (newLanguage) => {
        this.confirm.emit(newLanguage);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating language: ', err);
      }
    })
  }
}