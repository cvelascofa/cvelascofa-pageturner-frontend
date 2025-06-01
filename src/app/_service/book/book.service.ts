import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../../models/book/book.model';
import { AUTH_API } from '../../api-constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthHeaderService } from '../auth-header/auth-header.service';

@Injectable({
  providedIn: 'root'
})

export class BookService {

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) { }

  getAll(): Observable<Book[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Book[]>(`${AUTH_API}books`, options);
  }

  getAllSearchPaginated(title: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('title', title)
      .set('page', page.toString())
      .set('size', size.toString());
      const options = this.authHeaderService.getAuthHeadersWithParams(params);
      return this.http.get<any>(`${AUTH_API}books/search`, options);
  }

  getById(bookId: number): Observable<Book> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Book>(`${AUTH_API}books/${bookId}`, options);
  }

  delete(bookId: number): Observable<void> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}books/${bookId}`, options);
  }

  update(book: Book): Observable<Book> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.put<Book>(`${AUTH_API}books/${book.id}`, book, options);
  }

  create(book: Book): Observable<Book> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.post<Book>(`${AUTH_API}books`, book, options);
  }
  
}