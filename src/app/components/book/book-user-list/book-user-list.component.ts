import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { BookService } from '../../../_service/book/book.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { BookSearchComponent } from '../book-search/book-search.component';
import { User } from '../../../models/user/user.model';
import { TokenStorageService } from '../../../_service/token-storage/token-storage.service';
import { FavouriteService } from '../../../_service/favourite/favourite.service';
import { Favourite } from '../../../models/favourite/favourite.model';
import { BookWithFavourite } from '../../../models/book/book-with-favourite.model';

@Component({
  selector: 'app-book-user-list',
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    PaginationComponent,
    BookSearchComponent
  ],
  templateUrl: './book-user-list.component.html',
  styleUrl: './book-user-list.component.css'
})
export class BookUserListComponent implements OnInit {

  favourites: Favourite[] = [];
  currentUser!: User;

  searchQuery: string = '';

  pageSize: number = 10;
  currentPage: number = 0;
  totalPages: number = 0;
  books: BookWithFavourite[] = [];

  form!: FormGroup;

  constructor(
    private bookService: BookService,
    private tokenService: TokenStorageService,
    private favouriteService: FavouriteService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.loadFavouritesAndBooks();
  }

  onSubmit() {
    const term = this.form.value.searchTerm.toLowerCase();
    this.books = this.books.filter(book =>
      book.title.toLowerCase().includes(term)
    );
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    this.currentPage++;
  }

  getAllBooks(page: number = 0) {
    this.bookService.getAllSearchPaginated(this.searchQuery, page, this.pageSize).subscribe({
      next: (response) => {
        if (response && response.content && response.totalPages !== undefined) {
          this.books = response.content.map((book: BookWithFavourite) => {
            const bookWithFavourite = new BookWithFavourite();
            Object.assign(bookWithFavourite, book);
            bookWithFavourite.isFavourite = this.isFavourite(bookWithFavourite.id);
            return bookWithFavourite;
          });
          this.totalPages = response.totalPages;
        }
      },
      error: (err) => {
        console.error('Error fetching books:', err);
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getAllBooks(page);
  }

  onSearch(query: { [key: string]: string }) {
    this.searchQuery = query['title'] || '';
    this.currentPage = 0;
    this.getAllBooks();
  }

  onClearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.getAllBooks();
  }

  addToFavourites(bookId: number): void {
    const favourite: Favourite = {
      id: 0,
      userId: this.currentUser.id,
      bookId: bookId
    };

    this.favouriteService.create(favourite).subscribe({
      next: () => {
        this.loadFavouritesAndBooks();
        const book = this.books.find(b => b.id === bookId);
        if (book) {
          book.isFavourite = true;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error adding to favourites', err);
      }
    });
  }

  removeFromFavourites(bookId: number): void {
    const fav = this.favourites.find(f => f.bookId === bookId);
    if (!fav) return;

    this.favouriteService.delete(fav.id).subscribe({
      next: () => {
        this.favourites = this.favourites.filter(f => f.id !== fav.id);
        const book = this.books.find(b => b.id === bookId);
        if (book) {
          book.isFavourite = false;
        }
      },
      error: (err) => {
        console.error('Error removing from favourites', err);
      }
    });
  }

  toggleFavourite(bookId: number): void {
    const isFav = this.favourites.some(f => f.bookId === bookId);

    if (isFav) {
      this.removeFromFavourites(bookId);
    } else {
      this.addToFavourites(bookId);
    }
  }

  loadFavouritesAndBooks(): void {
    this.favouriteService.getAllByUserId(this.currentUser.id).subscribe({
      next: (favourites) => {
        this.favourites = favourites;
        this.getAllBooks();
      },
      error: (err) => {
        console.error('Error loading favourites', err)
        this.getAllBooks();
      }
    });
  }

  isFavourite(bookId: number): boolean {
    return this.favourites.some(f => f.bookId === bookId);
  }

  onImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = 'https://placehold.co/150x220?text=No+Cover';
  }

}