import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-search',
  imports: [FormsModule],
  templateUrl: './language-search.component.html',
  styleUrl: './language-search.component.css'
})
export class LanguageSearchComponent {

  @Input() placeholder: string = 'Search by name';
  @Output() search = new EventEmitter<{ name: string }>();

  query: { name: string } = { name: '' };

  onSearch() {
    this.search.emit(this.query);
  }

  clear() {
    this.query.name =  '';
    this.search.emit(this.query);
  }

}