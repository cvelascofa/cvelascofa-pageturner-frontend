import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../../_service/book/book.service';
import { Book } from '../../../models/book/book.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalComponent } from '../../shared/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { BookFormComponent } from '../book-form/book-form.component';
import { BookSearchComponent } from '../book-search/book-search.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-book-list',
  imports: [ModalComponent, FormsModule, PaginationComponent, BookSearchComponent, CommonModule, BookFormComponent, RouterLink],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})

export class BookListComponent implements OnInit {
  // Search
  searchQuery: string = '';

  // Pagination
  pageSize: number = 10;
  currentPage: number = 0;
  totalPages: number = 0;
  books: Book[] = [];

  // Delete modal
  bookToDelete: number | null = null; 
  @ViewChild('deleteModal') deleteModal!: ModalComponent;

  // Update modal
  showFormModal = false;
  bookToUpdate: Book = this.getEmptyBook();
  
  @ViewChild(BookFormComponent) formModal!: BookFormComponent;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.getAllBooks();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getAllBooks(page);
  }

  getAllBooks(page: number = 0, callback?: (books: Book[]) => void): void {
    this.bookService.getAllSearchPaginated(this.searchQuery, page, this.pageSize).subscribe({
      next: (response) => {
        if (response && response.content && response.totalPages !== undefined) {
          this.books = response.content;
          this.totalPages = response.totalPages;
          if (callback) callback(this.books);
        }
      },
      error: (err) => {
        console.error('Error fetching books:', err);
      },
    });
  }

  prepareDeleteConfirmation(id: number): void {
    this.bookToDelete = id;
    this.deleteModal.title = 'Delete Book';
    this.deleteModal.message = 'Are you sure you want to delete this book?';
    this.deleteModal.confirmButtonText = 'Delete';
    this.deleteModal.cancelButtonText = 'Cancel';
    this.deleteModal.type = 'danger';
  }

  prepareDeleteSuccess() {
    this.deleteModal.title = 'Book Deleted';
    this.deleteModal.message = 'The book has been successfully deleted.';
    this.deleteModal.type = 'info';
    this.deleteModal.confirmButtonText = '';
    this.deleteModal.cancelButtonText = 'Accept';
  }

  prepareDeleteError(err: HttpErrorResponse): void {
    this.deleteModal.title = 'Error';
    if (err.status === 409) {
      this.deleteModal.message = 'This book cannot be deleted because it is referenced elsewhere.';
    } else if (err.status === 404) {
      this.deleteModal.message = 'Book not found.';
    } else {
      this.deleteModal.message = 'Something went wrong. Please try again.';
    }
    this.deleteModal.type = 'info';
    this.deleteModal.confirmButtonText = '';
    this.deleteModal.cancelButtonText = 'Accept';
  }

  openDeleteModal(id: number) {
    this.prepareDeleteConfirmation(id);
    this.deleteModal.openModal();
  }

  getEmptyBook(): Book {
    return {
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
  }
  

  delete(id: number): void {
    this.bookService.delete(id).subscribe({
      next: () => {
        this.getAllBooks(this.currentPage, (books: any[]) => {
          if (books.length === 0 && this.currentPage > 0) {
            this.currentPage--;
            this.getAllBooks(this.currentPage);
          }
        });
  
        this.prepareDeleteSuccess();
        this.deleteModal.openModal();
      },
      error: (err: HttpErrorResponse) => {
        this.prepareDeleteError(err);
        this.deleteModal.openModal();
      }
    });
  }

  onConfirmForm(updatedBook: Book): void {
    const index = this.books.findIndex(b => b.id === updatedBook.id);
    
    if (index !== -1) {
      this.handleUpdate(updatedBook, index);
    } else {
      this.handleCreate(updatedBook);
    }
  
    this.formModal.closeModal();
  }
  
  handleUpdate(updatedBook: Book, index: number): void {
    this.books[index] = updatedBook;
  }
  
  handleCreate(newBook: Book): void {
    const isLastPage = this.currentPage === this.totalPages - 1;
  
    if (isLastPage) {
      if (this.books.length < this.pageSize) {
        this.books.push(newBook);
      } else {
        this.totalPages++;
      }
    } else {
      this.currentPage = 0;
      this.getAllBooks(0);
    }
  }
  
  onConfirmDelete(): void {
    if (this.bookToDelete !== null) {
      this.delete(this.bookToDelete);
    }
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

  openCreateModal(): void {
    this.openFormModal(this.getEmptyBook())
  }

  openEditModal(book: Book): void {
    this.openFormModal(book);
  }

  openFormModal(book: Book): void {
    this.bookToUpdate = { ...book };
    this.showFormModal = true;
    this.formModal.openModal(this.bookToUpdate);
  }

}