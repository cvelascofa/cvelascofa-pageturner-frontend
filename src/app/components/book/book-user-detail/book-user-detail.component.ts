import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../../_service/book/book.service';
import { ReviewService } from '../../../_service/review/review.service';
import { Review } from '../../../models/review/review.model';
import { CommonModule } from '@angular/common';
import { TokenStorageService } from '../../../_service/token-storage/token-storage.service';
import { ReadingProgressService } from '../../../_service/reading-progress/reading-progress.service';
import { ReadingProgress } from '../../../models/reading-progress/reading-progress.model';
import { ReadingStatusCode } from '../../../models/reading-status/reading-status.model';

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
  progressForm: FormGroup;
  formattedPublishDate: string;
  userId: number;
  progressData: ReadingProgress;
  totalPages: number;
  progressPercentage: number = 0;

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
    private readingProgressService: ReadingProgressService,
    private tokenService: TokenStorageService
  ) {
    this.form = this.fb.group({
      comment: '',
      rating: 1
    });
    this.progressForm = this.fb.group({
      progress: ['', Validators.required]
    });

    this.progressForm = this.fb.group({
      pagesRead: [0, [Validators.required, Validators.min(0), Validators.max(this.totalPages)]]
    });
  }

  ngOnInit() {
    this.userId = this.tokenService.getUser()?.id;
    const bookId = this.route.snapshot.paramMap.get('idBook');

    if (bookId) {
      this.bookService.getById(Number(bookId)).subscribe(book => {
        this.book = book;
        this.totalPages = this.book.totalPages;
  
        if (this.book && this.book.publishDate) {
          const publishDate = new Date(this.book.publishDate);
          this.formattedPublishDate = publishDate.toLocaleDateString('es-ES');
        }
        this.loadReviews(this.book.id);
        this.loadReadingProgress();
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

  calculateProgressPercentage(pagesRead: number) {
    if (this.totalPages && pagesRead !== undefined) {
      this.progressPercentage = (pagesRead / this.totalPages) * 100;
    }
  }

  submitProgress() {
    if (this.progressForm.valid) {
      const pagesRead = this.progressForm.value.pagesRead;

      const readingProgress: ReadingProgress = {
        userId: this.userId,
        bookId: this.book.id,
        pagesRead: pagesRead,
        //readingStatus: this.book.readingStatus,
      };
      if (this.progressData) {
        this.readingProgressService.update(this.userId, this.book.id, readingProgress).subscribe(updatedProgress => {
          this.progressData = updatedProgress;
          this.calculateProgressPercentage(updatedProgress.pagesRead);
        });
      } else {
        this.readingProgressService.create(readingProgress).subscribe(newProgress => {
          this.progressData = newProgress;
          this.calculateProgressPercentage(newProgress.pagesRead);
        });
      }
    }
  }

  loadReadingProgress() {
    this.readingProgressService.getProgress(this.userId, this.book.id).subscribe(progress => {
      if (progress) {
        this.progressData = progress;
        this.progressForm.patchValue({ pagesRead: progress.pagesRead });
        this.calculateProgressPercentage(progress.pagesRead);
      }
    });
  }
}