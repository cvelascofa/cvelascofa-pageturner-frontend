import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../../models/book/book.model';
import { AUTH_API } from '../../api-constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TokenStorageService } from '../token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})

export class BookService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenStorageService
  ) { }

  getAll(): Observable<Book[]> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.get<Book[]>(`${AUTH_API}books`, { headers });
  }

  getAllSearchPaginated(title: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('title', title)
      .set('page', page.toString())
      .set('size', size.toString());
    const headers = this.tokenService.getAuthHeaders();
    return this.http.get<any>(`${AUTH_API}books/search`, { params, headers });
  }

  getById(bookId: number): Observable<Book> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.get<Book>(`${AUTH_API}books/${bookId}`, { headers });
  }

  delete(bookId: number): Observable<void> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}books/${bookId}`, { headers });
  }

  update(book: Book): Observable<Book> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.put<Book>(`${AUTH_API}books/${book.id}`, book, { headers });
  }

  create(book: Book): Observable<Book> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.post<Book>(`${AUTH_API}books`, book, { headers });
  }
}