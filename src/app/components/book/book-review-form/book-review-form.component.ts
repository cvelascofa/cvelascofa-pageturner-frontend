import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review } from '../../../models/review/review.model';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../_service/review/review.service';

@Component({
  selector: 'app-book-review-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-review-form.component.html',
  styleUrl: './book-review-form.component.css'
})
export class BookReviewFormComponent {

  form!: FormGroup;
  hoverRating = 0;
  
  isVisible = false;
  isEditMode = false;

  @Input() review: Review = {
    userId: 0,
    bookId: 0,
    rating: 0,
    comment: ''
  };

  @Input() book: any;
  @Input() userId: number;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<Review>();

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required]
    });
  }

  openModal(): void {
    this.form.reset();
    this.isVisible = true;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.isVisible = false;
    document.body.classList.remove('modal-open');
    this.cancel.emit();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const newReview: Review = {
        userId: this.userId,
        bookId: this.book?.id,
        rating: this.form.value.rating,
        comment: this.form.value.comment.trim()
      };
      this.confirm.emit(newReview);
      this.closeModal();
    } else {
      alert('Please complete all fields correctly.');
    }
  }

  create(): void {
    this.reviewService.create(this.review).subscribe({
      next: (newReview) => {
        this.confirm.emit(newReview);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating review:', err);
      }
    });
  }

  setRating(rating: number) {
    this.form.get('rating')?.setValue(rating);
  }

}