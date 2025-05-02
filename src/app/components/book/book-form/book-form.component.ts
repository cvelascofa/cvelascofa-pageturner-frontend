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
  
  @Input() book: Book = { id: 0, title: '', description: '', publicationDate: new Date(), genre: { id: 0, name: '' }, author: { id: 0, name: '', bio: '', website: '', followersCount: 0 }  };
  
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
    console.log(this.book.publicationDate)
    this.isEditMode ? this.update() : this.create();
  }

  update(): void {
    if (this.book.publicationDate && typeof this.book.publicationDate === 'string') {
      this.book.publicationDate = new Date(this.book.publicationDate);
    }
  
    if (this.selectedAuthorId !== null) {
      this.book.author = this.authors.find(a => a.id === this.selectedAuthorId) || { id: 0, name: '', bio: '', website: '', followersCount: 0 };
    }
  
    this.bookService.update(this.book).subscribe({
      next: (updatedBook) => {
        console.log('Book updated:', JSON.stringify(updatedBook));
        this.confirm.emit(updatedBook);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating book:', err);
      }
    });
  }
  
  create() {
    if (this.book.publicationDate && typeof this.book.publicationDate === 'string') {
      this.book.publicationDate = new Date(this.book.publicationDate);
    }
  
    if (this.selectedAuthorId !== null) {
      this.book.author = this.authors.find(a => a.id === this.selectedAuthorId) || { id: 0, name: '', bio: '', website: '', followersCount: 0 };
    }
  
    this.bookService.create(this.book).subscribe({
      next: (newBook) => {
        console.log(JSON.stringify(this.book));
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
      next: (genres: Genre[]) => {
        this.genres = genres;
  
        const matchingGenre = this.genres.find(g => g.id === this.book.genre?.id);
        if (matchingGenre) {
          this.book.genre = matchingGenre;
        } else {
          this.book.genre = { id: 0, name: '' };
        }
      },
      error: (err) => {
        console.error('Error loading genres:', err);
      }
    });
  }
  

  loadAuthors(): void {
    this.authorService.getAll().subscribe({
      next: (authors: Author[]) => {
        this.authors = authors;

        if (this.book.author) {
          this.selectedAuthorId = this.book.author.id;
        } else {
          this.selectedAuthorId = null;
        }
      },
      error: (err: any) => {
        console.error('Error loading authors:', err);
      }
    });
  }
 
}