import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-user-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user-search.component.html',
  styleUrl: './admin-user-search.component.css'
})
export class AdminUserSearchComponent {
  @Input() placeholder: string = 'Buscar por nombre de usuario';
  @Output() search = new EventEmitter<{ username: string }>();

  query: { username: string } = { username: '' };

  onSearch() {
    this.search.emit(this.query);
  }

  clear() {
    this.query.username = '';
    this.search.emit(this.query);
  }
}
