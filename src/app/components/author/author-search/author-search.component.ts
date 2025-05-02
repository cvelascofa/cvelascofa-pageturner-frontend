import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-author-search',
  imports: [FormsModule],
  templateUrl: './author-search.component.html',
  styleUrl: './author-search.component.css'
})
export class AuthorSearchComponent {
  @Input() placeholder: string = 'Search by author name';
  @Output() search = new EventEmitter<{ name: string }>();

  query: { name: string } = { name: '' };

  onSearch() {
    this.search.emit(this.query);
  }

  clear() {
    this.query.name = '';
    this.search.emit(this.query);
  }
}