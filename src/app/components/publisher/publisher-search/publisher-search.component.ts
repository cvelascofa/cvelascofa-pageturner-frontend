import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-publisher-search',
  imports: [FormsModule],
  templateUrl: './publisher-search.component.html',
  styleUrl: './publisher-search.component.css'
})
export class PublisherSearchComponent {
  
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
