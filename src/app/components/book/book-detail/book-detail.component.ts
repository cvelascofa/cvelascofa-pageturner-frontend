import { Component, OnInit } from '@angular/core';
import { Book } from '../../../models/book/book.model';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../../_service/book/book.service';

@Component({
  selector: 'app-book-detail',
  imports: [],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent implements OnInit {

  book: Book | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getById(Number(id)).subscribe(book => {
        this.book = book;
      });
    }
  }
}
