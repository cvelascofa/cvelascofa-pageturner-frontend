import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { BookService } from '../../../_service/book/book.service';
import { ReviewService } from '../../../_service/review/review.service';
import { Review } from '../../../models/review/review.model';
import { CommonModule } from '@angular/common';
import { TokenStorageService } from '../../../_service/token-storage/token-storage.service';
import { ReadingProgressService } from '../../../_service/reading-progress/reading-progress.service';
import { ReadingProgress } from '../../../models/reading-progress/reading-progress.model';
import { BookReviewFormComponent } from '../book-review-form/book-review-form.component';
import { UserService } from '../../../_service/user/user.service';
import { ReviewWithUser } from '../../../models/review/review-with-user.model';
import { BookReadingStatusFormComponent } from '../book-reading-status-form/book-reading-status-form.component';

@Component({
  selector: 'app-book-user-detail',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule, BookReviewFormComponent, BookReadingStatusFormComponent],
  templateUrl: './book-user-detail.component.html',
  styleUrl: './book-user-detail.component.css'
})

export class BookUserDetailComponent {
  @Input() book: any;
  fallbackImage: string = 'https://placehold.co/150x220?text=No+Cover';

  @ViewChild(BookReviewFormComponent) reviewFormModal!: BookReviewFormComponent;

  @ViewChild(BookReadingStatusFormComponent) readingProgressModal!: BookReadingStatusFormComponent;

  reviews: ReviewWithUser[] = [];
  form: FormGroup;
  progressForm: FormGroup;
  formattedPublishDate: string;
  userId: number;
  progressDataList: ReadingProgress[] = [];
  progressData: ReadingProgress;
  totalPages: number;
  progressPercentage: number = 0;

  canComment = true;
  showReviewForm: boolean = true;
  userHasReviewed = false;

  isLoading = true;

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
    private tokenService: TokenStorageService,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      comment: '',
      rating: 1
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

        if (this.book.publishDate) {
          const publishDate = new Date(this.book.publishDate);
          this.formattedPublishDate = publishDate.toLocaleDateString('es-ES');
        }

        this.loadReviews(this.book.id);
        this.loadReadingProgress();

        this.isLoading = false;
      });
    }
  }

  openReadingProgressModal(): void {
    this.readingProgressModal.openModal(0, this.readingProgressModal.getCurrentDate());
  }

  onReadingProgressConfirm(progress: ReadingProgress): void {
    this.readingProgressService.create(progress).subscribe(created => {
      this.progressData = created;
      this.calculateProgressPercentage(created.pagesRead);
      this.loadReadingProgress();

      this.form.reset({
        pagesRead: 0,
        progressDate: this.getCurrentDate()
      });
    });
  }

  private getCurrentDate(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
  }

  loadReviews(bookId: number) {
    this.reviewService.getByBookId(bookId).subscribe(reviews => {
      this.reviews = reviews.filter(r => r.bookId === bookId);

      this.reviews.forEach(review => {
        this.userService.getUserById(review.userId).subscribe(user => {
          review.user = user;
        });
      });

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
      const progressDate = this.progressForm.value.progressDate;

      const readingProgress: ReadingProgress = {
        userId: this.userId,
        bookId: this.book.id,
        readingStatus: this.getReadingStatusAutomatically(pagesRead),
        pagesRead: pagesRead,
        progressDate: progressDate
      };

      console.log(readingProgress);

      this.readingProgressService.create(readingProgress).subscribe(newProgress => {
        this.progressData = newProgress;
        this.calculateProgressPercentage(newProgress.pagesRead);
        this.progressForm.reset({ pagesRead: 0 });
      });
    }
  }

  loadReadingProgress() {
    this.readingProgressService.getProgress(this.userId, this.book.id).subscribe(progress => {
      if (progress) {
        this.progressDataList = progress;
      }
    });
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.fallbackImage;
  }

  openCreateReviewModal() {
    this.reviewFormModal.openModal();
  }

  onReviewConfirm(newReview: Review) {
    this.createReview(newReview);
    this.reviewFormModal.closeModal();
  }

  createReview(newReview: Review) {
    this.reviewService.create(newReview).subscribe(createdReview => {
      this.reviews.push(createdReview);
      this.loadReadingProgress()
    });
  }

  getAvatarUrl(username: string): string {
    const name = username || 'Anonymous';
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?background=random&name=${encodedName}`;
  }

  handleReadingProgressCancel(): void {
    this.readingProgressModal.closeModal();
  }

  getTotalPagesRead(): number {
    return this.progressDataList.reduce((acc, curr) => acc + curr.pagesRead, 0);
  }

  getReadingStatusAutomatically(pagesRead: number): string {
    if (!this.book || !this.book.totalPages) return 'READING';
    if (pagesRead >= this.book.totalPages) {
      return 'COMPLETED';
    }
    return 'READING';
  }

}