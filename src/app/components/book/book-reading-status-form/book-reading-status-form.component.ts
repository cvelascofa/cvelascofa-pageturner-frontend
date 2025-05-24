import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReadingProgress } from '../../../models/reading-progress/reading-progress.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReadingProgressService } from '../../../_service/reading-progress/reading-progress.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-book-reading-status-form',
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent],
  templateUrl: './book-reading-status-form.component.html',
  styleUrl: './book-reading-status-form.component.css'
})
export class BookReadingStatusFormComponent {

  form!: FormGroup;
  isVisible = false;

  @Input() book: any;
  @Input() userId!: number;
  @Input() progress: ReadingProgress | null = null;
  @Input() totalPages: number = 0;
  @Input() totalBookPages: number = 0;
  @Input() totalPagesRead: number = 0;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<ReadingProgress>();

  progressListPaginated: ReadingProgress[] = [];
  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 4;

  constructor(
    private fb: FormBuilder,
    private progressService: ReadingProgressService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      pagesRead: [
        this.progress?.pagesRead ?? 0,
        [Validators.required, Validators.min(0)]
      ],
      progressDate: [
        this.progress?.progressDate ? this.progress.progressDate.slice(0, 10) : this.getCurrentDate(),
        Validators.required
      ]
    });
  }

   isFormBlocked(): boolean {
    console.log("pages total " + this.totalBookPages);
    console.log("pages read " + this.totalPagesRead)
    return this.form.value.pagesRead + this.totalPagesRead > this.totalBookPages || this.totalPagesRead >= this.totalBookPages;
  }


  getCurrentDate(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
  }


  openModal(pagesRead: number = 0, progressDate: string = this.getCurrentDate()): void {
    this.form.reset({
      pagesRead,
      progressDate
    });
    this.isVisible = true;
    this.loadProgressList();
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.isVisible = false;
    document.body.classList.remove('modal-open');
  }

  onSubmit(): void {
    if (this.form.valid) {
      const dateOnly: string = this.form.value.progressDate;
      const progressDateTime = dateOnly + 'T00:00:00';

      const progress: ReadingProgress = {
        userId: this.userId,
        bookId: this.book?.id,
        readingStatus: this.getReadingStatusAutomatically(),
        pagesRead: this.form.value.pagesRead,
        progressDate: progressDateTime
      };

      this.confirm.emit(progress);
      this.loadProgressList();
      this.closeModal();
      this.form.reset({
        pagesRead: 0,
        progressDate: this.getCurrentDate()
      });
    } else {
      alert('Please complete the required fields.');
    }

  }

  getReadingStatusAutomatically(): string {
    if (!this.book || !this.book.totalPages) return 'READING';
    if (this.form.value.pagesRead >= this.book.totalPages) {
      return 'COMPLETED';
    }
    return 'READING';
  }

  loadProgressList(page: number = 0): void {
    if (!this.userId || !this.book?.id) return;

    this.progressService
      .getAllPaginatedByUserAndBook(this.userId, this.book.id, page, this.pageSize)
      .subscribe(response => {
        this.progressListPaginated = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
      });
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.loadProgressList(newPage);
    }
  }

}