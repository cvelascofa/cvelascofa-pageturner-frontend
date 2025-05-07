import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../../_service/book/book.service';

@Component({
  selector: 'app-book-user-detail',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './book-user-detail.component.html',
  styleUrl: './book-user-detail.component.css'
})
export class BookUserDetailComponent {
  @Input() book: any;
  form: FormGroup;
  formattedPublishDate: string;

  isUserLogged = true;
  isUserBookOwner = false;
  isReservedByCurrentUser = false;
  isAvailable = true;
  canComment = false;

  rating = false;
  ratingToAdd = {
    score: 1,
    comment: ''
  };

  reviews = [
    {
      user: { username: 'johndoe' },
      comment: 'Buen libro, lo disfruté mucho!',
      score: 4
    },
    {
      user: { username: 'janedoe' },
      comment: 'No fue lo que esperaba.',
      score: 2
    }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bookService: BookService
  ) {
    this.form = this.fb.group({
      comment: '',
      score: 1
    });
  }

  ngOnInit() {
    const bookId = this.route.snapshot.paramMap.get('idBook');

    if (bookId) {
      this.bookService.getById(Number(bookId)).subscribe(book => {
        this.book = book;
        
        if (this.book && this.book.publishDate) {
          const publishDate = new Date(this.book.publishDate);
          this.formattedPublishDate = publishDate.toLocaleDateString('es-ES');
        }
      });
    }

    if (this.book) {
      this.isAvailable = this.book.reserved === 0;
    }
  }

  createReservation() {
    this.isAvailable = false;
    this.isReservedByCurrentUser = true;
  }

  returnBook() {
    this.isAvailable = true;
    this.isReservedByCurrentUser = false;
    this.canComment = true;
  }

  rateBook() {
    this.rating = true;
  }

  addRating() {
    this.reviews.push({
      user: { username: 'currentUser' },
      comment: this.form.value.comment,
      score: this.form.value.score
    });
    this.rating = false;
    this.canComment = false;
    this.form.reset();
  }

  getStarArray(score: number, total: number) {
    return Array.from({ length: total });
  }
}