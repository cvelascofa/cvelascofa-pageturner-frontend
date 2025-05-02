import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Author } from '../../../models/author/author.model';
import { AuthorService } from '../../../_service/author/author.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-author-form',
  imports: [FormsModule,CommonModule],
  templateUrl: './author-form.component.html',
  styleUrl: './author-form.component.css'
})
export class AuthorFormComponent {
  isVisible: boolean = false;
  isEditMode: boolean = false;

  @Input() author: Author = { 
    id: 0, 
    name: '', 
    bio: '', 
    website: '', 
    followersCount: 0 
  };

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<Author>();

  constructor(private authorService: AuthorService) {}

  openModal(author: Author): void {
    this.author = { ...author };
    this.isEditMode = author.id !== 0;
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
    this.authorService.update(this.author).subscribe({
      next: (updatedAuthor) => {
        this.confirm.emit(updatedAuthor);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating author:', err);
      },
    });
  }

  create(): void {
    this.authorService.create(this.author).subscribe({
      next: (newAuthor) => {
        this.confirm.emit(newAuthor);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating author: ', err);
      },
    });
  }

}