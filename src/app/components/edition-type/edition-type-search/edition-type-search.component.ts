import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edition-type-search',
  imports: [FormsModule],
  templateUrl: './edition-type-search.component.html',
  styleUrl: './edition-type-search.component.css'
})
export class EditionTypeSearchComponent {

  @Input() placeholder: string = 'Search by edition type name';
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
