import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../_service/book/book.service';
import { Book } from '../../../models/book/book.model';

@Component({
  selector: 'app-book-list',
  imports: [],
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
    console.log("adeu")
    this.getAllBooks();
  }
  
  getAllBooks() {
    this.bookService.getAllBooks().subscribe(books => {
      this.books = books;
      console.log(this.books);
    });
  }

}

