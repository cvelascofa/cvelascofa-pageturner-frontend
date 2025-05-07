import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-search',
  imports: [FormsModule],
  templateUrl: './book-search.component.html',
  styleUrl: './book-search.component.css'
})
export class BookSearchComponent {
  @Input() placeholder: string = 'Search by book title';
  @Output() search = new EventEmitter<{ title: string }>();

  query: { title: string } = { title: '' };

  onSearch() {
    this.search.emit(this.query);
  }

  clear() {
    this.query.title = '';
    this.search.emit(this.query);
  }
}