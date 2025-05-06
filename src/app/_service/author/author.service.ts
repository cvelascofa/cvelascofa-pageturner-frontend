import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Author } from '../../models/author/author.model';
import { Observable } from 'rxjs';
import { AUTH_API } from '../../api-constants';
import { TokenStorageService } from '../token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenStorageService
  ) { }

  getAll(): Observable<Author[]> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.get<Author[]>(`${AUTH_API}authors`, { headers });
  }

  getAllSearchPaginated(name: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());
    const headers = this.tokenService.getAuthHeaders();
    return this.http.get<any>(`${AUTH_API}authors/search`, { params, headers });
  }

  getById(authorId: number): Observable<Author> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.get<Author>(`${AUTH_API}authors/${authorId}`, { headers });
  }

  delete(authorId: number): Observable<void> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}authors/${authorId}`, { headers });
  }

  update(author: Author): Observable<Author> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.put<Author>(`${AUTH_API}authors/${author.id}`, author, { headers });
  }

  create(author: Author): Observable<Author> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.post<Author>(`${AUTH_API}authors`, author, { headers });
  }

  getAllByBookIdSearchPaginated(
    bookId: number,
    description: string = '',
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    const params = new HttpParams()
      .set('description', description)
      .set('page', page.toString())
      .set('size', size.toString());
    const headers = this.tokenService.getAuthHeaders();
    return this.http.get<any>(`${AUTH_API}book-editions/book/${bookId}/search`, { params, headers });
  }
}