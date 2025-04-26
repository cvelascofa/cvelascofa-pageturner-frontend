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
  
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<Genre>();

  constructor(private genreService: GenreService) { }

  openModal(genre: Genre): void {
    this.genre = { ...genre };
    this.isVisible = true;
    document.body.classList.add('modal-open');
  }
  
  closeModal(): void {
    this.isVisible = false;
    document.body.classList.remove('modal-open');
  }

  onUpdate(): void {
    console.log("onUpdate")
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
}