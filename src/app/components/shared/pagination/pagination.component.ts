import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})

export class PaginationComponent {

  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;

  @Output() pageChange = new EventEmitter<number>();

  goToPreviousPage() {
    if (this.currentPage > 0) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  getPageLabel(page: number | string): string {
    return typeof page === 'number' ? (page + 1).toString() : page;
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  goToPage(page: number | string) {
    if (typeof page === 'number') {
      this.pageChange.emit(page);
    }
  }
  
  getPageNumbers(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const range: (number | string)[] = [];
    
    const delta = 2;
    const left = Math.max(current - delta, 0);
    const right = Math.min(current + delta, total - 1);
    
    if (left > 0) {
      range.push(0);
      if (left > 1) {
        range.push('...');
      }
    }
    
    for (let i = left; i <= right; i++) {
      range.push(i);
    }
    
    if (right < total - 1) {
      if (right < total - 2) {
        range.push('...');
      }
      range.push(total - 1);
    }
    
    return range;
  }
}