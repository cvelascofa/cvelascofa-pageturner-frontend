import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Genre } from '../../../models/genre/genre.model';
import { GenreService } from '../../../_service/genre/genre.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-genre-update',
  imports: [CommonModule, FormsModule],
  templateUrl: './genre-update.component.html',
  styleUrl: './genre-update.component.css'
})
export class GenreUpdateComponent {
  isVisible = false;
  @Input() genre: Genre = { id: 0, name: '' };
  
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<Genre>();

  constructor(private genreService: GenreService) { }

  openModal(genre: Genre): void {
    this.genre = { ...genre };
    this.isVisible = true;
  }
  
  closeModal(): void {
    this.isVisible = false;
    this.close.emit();
  }

  onUpdate(): void {
    this.genreService.update(this.genre).subscribe({
      next: (updatedGenre) => {
        this.update.emit(updatedGenre);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating genre:', err);
      }
    });
  }
}
