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


@Component({
  selector: 'app-book-list',
  imports: [ModalComponent, FormsModule, PaginationComponent, BookSearchComponent, CommonModule, BookFormComponent],
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
  bookToUpdate: Book = { id: 0, title: '', description: '', publicationDate: new Date(), genre: { id: 0, name: '' }, author: { id: 0, name: '', bio: '', website: '', followersCount: 0 } };
  @ViewChild(BookFormComponent) formModal!: BookFormComponent;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.getAllBooks();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getAllBooks(page);
  }

  getAllBooks(page: number = 0) {
    this.bookService.getAllSearchPaginated(this.searchQuery, page, this.pageSize).subscribe({
      next: (response) => {
        if (response && response.content && response.totalPages !== undefined) {
          this.books = response.content;
          this.totalPages = response.totalPages;
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

  delete(id: number): void {
    this.bookService.delete(id).subscribe({
      next: () => {
        this.books = this.books.filter(book => book.id !== id);
  
        if (this.books.length < this.pageSize) {
          if (this.currentPage < this.totalPages - 1) {
            this.getAllBooks(this.currentPage + 1);
          } else {
            if (this.currentPage > 0) {
              this.currentPage--;
              this.getAllBooks(this.currentPage);
            } else {
              this.getAllBooks(this.currentPage);
            }
          }
        } else {
          this.getAllBooks(this.currentPage);
        }
  
        this.deleteModal.closeModal();
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
    console.log('Editando libro:', updatedBook);
    this.books[index] = updatedBook;
  }
  
  handleCreate(newBook: Book): void {
    const isLastPage = this.currentPage === this.totalPages - 1;
    console.log('Editando libro:', newBook);
  
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
    this.openFormModal({
      id: 0,
      title: '',
      description: '',
      publicationDate: new Date(),
      genre: { id: 0, name: '' },
      author: { id: 0, name: '', bio: '', website: '', followersCount: 0 }
    });
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