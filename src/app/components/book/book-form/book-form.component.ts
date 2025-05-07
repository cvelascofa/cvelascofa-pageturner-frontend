import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Book } from '../../../models/book/book.model';
import { BookService } from '../../../_service/book/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Author } from '../../../models/author/author.model';
import { Genre } from '../../../models/genre/genre.model';
import { GenreService } from '../../../_service/genre/genre.service';
import { AuthorService } from '../../../_service/author/author.service';
import { PublisherService } from '../../../_service/publisher/publisher.service';
import { Publisher } from '../../../models/publisher/publisher.model';
import { EditionTypeService } from '../../../_service/edition-type/edition-type.service';
import { EditionType } from '../../../models/edition-type/edition-type.model';
import { LanguageService } from '../../../_service/language/language.service';
import { Language } from '../../../models/language/language.model';

@Component({
  selector: 'app-book-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})

export class BookFormComponent {
  isVisible: boolean  = false;
  isEditMode: boolean = false;
  
  @Input() book: Book = {
    id: 0,
    title: '',
    description: '',
    coverImage: '',
    isbn: '',
    publicationDate: new Date(),
    pages: 0,
    genre: { id: 0, name: '' },
    language: { id: 0, name: '', code: '' },
    author: { id: 0, name: '', bio: '', website: '', followersCount: 0 },
    publisher: { id: 0, name: '', website: '', country: '' },
    editionType: { id: 0, name: '' }
  };
  
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<Book>();

  authors: Author[] = [];
  genres: Genre[] = [];
  publishers: Publisher[] = [];
  editionTypes: EditionType[] = [];
  languages: Language[] = [];

  selectedAuthor: Author | null = null;

  constructor(
    private bookService: BookService,
    private genreService: GenreService,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private editionTypeService: EditionTypeService,
    private languageService: LanguageService

  ) { }


  openModal(book: Book): void {
    this.book = { ...book };
    this.isEditMode = book.id !== 0;
    this.isVisible = true;
    document.body.classList.add('modal-open');

    this.loadGenres();
    this.loadAuthors();
    this.loadPublishers();
    this.loadEditionTypes();
    this.loadLanguages();
  }
  
  closeModal(): void {
    this.isVisible = false;
    document.body.classList.remove('modal-open');
  }

  onSubmit(): void {
    this.isEditMode ? this.update() : this.create();
  }

  update(): void {
    if (this.book.publicationDate && typeof this.book.publicationDate === 'string') {
      this.book.publicationDate = new Date(this.book.publicationDate);
    }
  
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
  
  create(): void {
    if (this.book.publicationDate && typeof this.book.publicationDate === 'string') {
      this.book.publicationDate = new Date(this.book.publicationDate);
    }
  
    this.bookService.create(this.book).subscribe({
      next: (newBook) => {
        this.confirm.emit(newBook);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating book:', err);
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
        
        const matchingAuthor = this.authors.find(a => a.id === this.book.author?.id);
        if (matchingAuthor) {
          this.book.author = matchingAuthor; 
        } else {
          this.book.author = { id: 0, name: '', bio: '', website: '', followersCount: 0 };
        }
      },
      error: (err: any) => {
        console.error('Error loading authors:', err);
      }
    });
  }

  loadPublishers(): void {
    this.publisherService.getAll().subscribe({
      next: (publishers) => {
        this.publishers = publishers;
  
        const matchingPublisher = this.publishers.find(p => p.id === this.book.publisher?.id);
        if (matchingPublisher) {
          this.book.publisher = matchingPublisher;
        } else {
          this.book.publisher = { id: 0, name: '', website: '', country: '' };
        }
      },
      error: (err) => {
        console.error('Error loading publishers:', err);
      }
    });
  }
  
  loadEditionTypes(): void {
    this.editionTypeService.getAll().subscribe({
      next: (editionTypes) => {
        this.editionTypes = editionTypes;
  
        const matchingEditionType = this.editionTypes.find(e => e.id === this.book.editionType?.id);
        if (matchingEditionType) {
          this.book.editionType = matchingEditionType;
        } else {
          this.book.editionType = { id: 0, name: '' };
        }
      },
      error: (err) => {
        console.error('Error loading edition types:', err);
      }
    });
  }

  loadLanguages(): void {
    this.languageService.getAll().subscribe({
      next: (languages) => {
        this.languages = languages;
  
        const matchingLanguage = this.languages.find(l => l.id === this.book.language?.id);
        if (matchingLanguage) {
          this.book.language = matchingLanguage;
        } else {
          this.book.language = { id: 0, name: '', code: '' };
        }
      },
      error: (err) => {
        console.error('Error loading languages:', err);
      }
    });
  }
  
}