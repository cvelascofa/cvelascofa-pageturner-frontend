import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Book } from '../../../models/book/book.model';
import { BookService } from '../../../_service/book/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Author } from '../../../models/author/author.model';
import { Genre } from '../../../models/genre/genre.model';
import { GenreService } from '../../../_service/genre/genre.service';
import { AuthorService } from '../../../_service/author/author.service';

@Component({
  selector: 'app-book-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})

export class BookFormComponent {
  isVisible: boolean  = false;
  isEditMode: boolean = false;
  
  @Input() book: Book = { id: 0, title: '', description: '', publicationYear: 0, genre: { id: 0, name: '' }, authors: [] };
  
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<Book>();

  authors: Author[] = [];
  genres: Genre[] = [];

  selectedAuthorId: number | null = null;
  selectedAuthor: Author | null = null;


  constructor(
    private bookService: BookService,
    private genreService: GenreService,
    private authorService: AuthorService
  ) { }


  openModal(book: Book): void {
    this.book = { ...book };
    this.isEditMode = book.id !== 0;
    this.isVisible = true;
    document.body.classList.add('modal-open');

    this.loadGenres();
    this.loadAuthors();
  }
  
  closeModal(): void {
    this.isVisible = false;
    document.body.classList.remove('modal-open');
  }

  onSubmit(): void {
    this.isEditMode ? this.update() : this.create();
  }

  update(): void {
    this.bookService.update(this.book).subscribe({
      next: (updatedBook) => {
        this.confirm.emit(updatedBook);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating book:', err);
      }
    });
  }

  create() {
    if (this.book.publicationYear) {
      this.book.publicationYear = new Date(this.book.publicationYear).getFullYear();
    }

    this.book.authors = this.selectedAuthor ? [this.selectedAuthor] : [];
  
    this.bookService.create(this.book).subscribe({
      next: (newBook) => {
        this.confirm.emit(newBook);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating book: ', err);
      }
    });
  }
  
  loadGenres(): void {
    this.genreService.getAll().subscribe({
      next: (data) => {
        this.genres = data;
      },
      error: (err) => {
        console.error('Error loading genres:', err);
      }
    });
  }

  loadAuthors(): void {
    this.authorService.getAll().subscribe({
      next: (data) => {
        this.authors = data;
      },
      error: (err) => {
        console.error('Error loading authors:', err);
      }
    });
  }

  isAuthorSelected(authorId: number): boolean {
    return this.book.authors?.some(a => a.id === authorId) ?? false;
  }

  addAuthor(): void {
    if (this.selectedAuthorId !== null) {
      const selectedAuthor = this.authors.find(a => a.id === this.selectedAuthorId);
      if (selectedAuthor && !this.book.authors.some(a => a.id === selectedAuthor.id)) {
        this.book.authors.push(selectedAuthor);
      }
    }
  }
  
}