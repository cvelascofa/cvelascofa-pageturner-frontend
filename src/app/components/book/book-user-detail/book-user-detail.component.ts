import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../../_service/book/book.service';
import { ReviewService } from '../../../_service/review/review.service';
import { Review } from '../../../models/review/review.model';
import { CommonModule } from '@angular/common';
import { TokenStorageService } from '../../../_service/token-storage/token-storage.service';

@Component({
  selector: 'app-book-user-detail',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './book-user-detail.component.html',
  styleUrl: './book-user-detail.component.css'
})
export class BookUserDetailComponent {
  @Input() book: any;
  reviews: Review[] = [];
  form: FormGroup;
  formattedPublishDate: string;
  userId: number;

  canComment = true;
  showReviewForm: boolean = true;
  userHasReviewed = false;


  rating = false;
  ratingToAdd = {
    rating: 1,
    comment: ''
  };


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bookService: BookService,
    private reviewService: ReviewService,
    private tokenService: TokenStorageService
  ) {
    this.form = this.fb.group({
      comment: '',
      rating: 1
    });
  }

  ngOnInit() {
    this.userId = this.tokenService.getUser()?.id;
    const bookId = this.route.snapshot.paramMap.get('idBook');

    if (bookId) {
      this.bookService.getById(Number(bookId)).subscribe(book => {
        this.book = book;
  
        if (this.book && this.book.publishDate) {
          const publishDate = new Date(this.book.publishDate);
          this.formattedPublishDate = publishDate.toLocaleDateString('es-ES');
        }
  
  
        this.loadReviews(this.book.id);
      });
    }
  }
  

  loadReviews(bookId: number) {
    this.reviewService.getByBookId(bookId).subscribe(reviews => {
      this.reviews = reviews.filter(r => r.bookId === bookId);
      this.checkIfUserHasReviewed();
    });
  }

  checkIfUserHasReviewed() {
    const userReview = this.reviews.find(review => review.userId === this.userId);
    if (userReview) {
      this.showReviewForm = false;
    }
  }

  rateBook() {
    this.rating = true;
  }

  addRating() {
    const newReview: Review = {
      userId: this.userId,
      bookId: this.book.id,
      rating: this.form.value.rating,
      comment: this.form.value.comment
    };
  
    this.reviewService.create(newReview).subscribe(review => {
      this.reviews.push(review);
      this.rating = false;
      this.canComment = false;
      this.form.reset();
      this.checkIfUserHasReviewed();
    });
  }
}