import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../../models/book/book.model';
import { AUTH_API } from '../../api-constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class BookService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(`${AUTH_API}books`);
  }

  getAllSearchPaginated(title: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = {
      title,
      page: page.toString(),
      size: size.toString()
    };
    return this.http.get<any>(`${AUTH_API}books/search`, { params });
  }

  getById(bookId: number): Observable<Book> {
    return this.http.get<Book>(`${AUTH_API}books/${bookId}`);
  }

  delete(bookId: number): Observable<void> {
    return this.http.delete<void>(`${AUTH_API}books/${bookId}`);
  }

  update(book: Book): Observable<Book> {
    return this.http.put<Book>(`${AUTH_API}books/${book.id}`, book);
  }

  create(book: Book): Observable<Book> {
    return this.http.post<Book>(`${AUTH_API}books`, book);
  }
}