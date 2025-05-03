import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-user-list',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './book-user-list.component.html',
  styleUrl: './book-user-list.component.css'
})
export class BookUserListComponent implements OnInit {
  form!: FormGroup;

  // Aquí declaramos la lista de libros
  books: any[] = []; // o puedes usar tu modelo Book[] si lo tienes

  currentPage = 1;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      searchTerm: ['']
    });

    // Por ahora, unos libros de ejemplo
    this.books = [
      {
        id: 1,
        title: 'The Great Gatsby',
        coverImage: 'https://example.com/gatsby.jpg'
      },
      {
        id: 2,
        title: '1984',
        coverImage: 'https://example.com/1984.jpg'
      },
      {
        id: 3,
        title: 'To Kill a Mockingbird',
        coverImage: 'https://example.com/mockingbird.jpg'
      }
    ];
  }

  onSubmit() {
    const term = this.form.value.searchTerm.toLowerCase();
    // Aquí filtras según el título (esto es opcional, pero útil)
    // Esto debería reemplazarse por una llamada al backend si es necesario
    this.books = this.books.filter(book =>
      book.title.toLowerCase().includes(term)
    );
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      // lógica para cargar libros de la página anterior si aplica
    }
  }

  nextPage() {
    this.currentPage++;
    // lógica para cargar libros de la siguiente página si aplica
  }
}
