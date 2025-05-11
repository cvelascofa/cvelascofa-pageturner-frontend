import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-genre-search',
  imports: [FormsModule, CommonModule],
  templateUrl: './genre-search.component.html',
  styleUrl: './genre-search.component.css'
})
export class GenreSearchComponent {
  @Input() placeholder: string = 'Search by genre name';
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