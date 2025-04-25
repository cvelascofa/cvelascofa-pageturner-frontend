import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../_service/book/book.service';
import { Book } from '../../../models/book/book.model';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-book-list',
  imports: [RouterLink],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})

export class BookListComponent implements OnInit {
  books: Book[] = [];

  constructor(
    private bookService: BookService
  ) {
  }
  
  ngOnInit(): void {
    this.getAllBooks();
  }
  
  getAllBooks() {
    this.bookService.getAll().subscribe(books => {
      this.books = books;
    });
  }

}

