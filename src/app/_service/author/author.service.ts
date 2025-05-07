import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Author } from '../../models/author/author.model';
import { Observable } from 'rxjs';
import { AUTH_API } from '../../api-constants';
import { AuthHeaderService } from '../auth-header/auth-header.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) { }

  getAll(): Observable<Author[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Author[]>(`${AUTH_API}authors`, options);
  }

  getAllSearchPaginated(name: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());
      const options = this.authHeaderService.getAuthHeadersWithParams(params);
      return this.http.get<any>(`${AUTH_API}authors/search`, options);
  }

  getById(authorId: number): Observable<Author> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Author>(`${AUTH_API}authors/${authorId}`, options);
  }

  delete(authorId: number): Observable<void> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}authors/${authorId}`, options);
  }

  update(author: Author): Observable<Author> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.put<Author>(`${AUTH_API}authors/${author.id}`, author, options);
  }

  create(author: Author): Observable<Author> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.post<Author>(`${AUTH_API}authors`, author, options);
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
      const options = this.authHeaderService.getAuthHeadersWithParams(params);
      return this.http.get<any>(`${AUTH_API}book-editions/book/${bookId}/search`, options);
    }
}