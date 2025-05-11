import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Author } from '../../models/author/author.model';
import { Observable } from 'rxjs';
import { AUTH_API } from '../../api-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Author[]> {
    return this.http.get<Author[]>(`${AUTH_API}authors`);
  }

  getAllSearchPaginated(name: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = {
      name,
      page: page.toString(),
      size: size.toString()
    };
    return this.http.get<any>(`${AUTH_API}authors/search`, { params });
  }

  getById(authorId: number): Observable<Author> {
    return this.http.get<Author>(`${AUTH_API}authors/${authorId}`);
  }

  delete(authorId: number): Observable<void> {
    return this.http.delete<void>(`${AUTH_API}authors/${authorId}`);
  }

  update(author: Author): Observable<Author> {
    return this.http.put<Author>(`${AUTH_API}authors/${author.id}`, author);
  }

  create(author: Author): Observable<Author> {
    return this.http.post<Author>(`${AUTH_API}authors`, author);
  }
}