import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  RouterLink, RouterModule } from '@angular/router';
import { BookService } from '../../../_service/book/book.service';
import { Book } from '../../../models/book/book.model';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { BookSearchComponent } from '../book-search/book-search.component';

@Component({
  selector: 'app-book-user-list',
  imports: [FormsModule, RouterModule, CommonModule, ReactiveFormsModule, RouterModule, RouterLink, PaginationComponent, BookSearchComponent],
  templateUrl: './book-user-list.component.html',
  styleUrl: './book-user-list.component.css'
})
export class BookUserListComponent implements OnInit {
   // Search
    searchQuery: string = '';
  
    // Pagination
    pageSize: number = 10;
    currentPage: number = 0;
    totalPages: number = 0;
    books: Book[] = [];
  
  form!: FormGroup;

  constructor(private fb: FormBuilder, private bookService: BookService) {}

  ngOnInit(): void {
    this.getAllBooks();
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
          this.books = response.content;
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
  
}