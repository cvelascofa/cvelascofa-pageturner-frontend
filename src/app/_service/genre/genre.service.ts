import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre } from '../../models/genre/genre.model';
import { AUTH_API } from '../../api-constants';
import { Observable } from 'rxjs';
import { AuthHeaderService } from '../auth-header/auth-header.service';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) { }

  getAll(): Observable<Genre[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Genre[]>(`${AUTH_API}genres`, options);
  }

  getAllSearchPaginated(name: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());
      const options = this.authHeaderService.getAuthHeadersWithParams(params);
      return this.http.get<any>(`${AUTH_API}genres/search`, options);
  }
  
  getById(genreId: number): Observable<Genre> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Genre>(`${AUTH_API}genres/${genreId}`, options);
  }

  delete(genreId: number): Observable<void> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}genres/${genreId}`, options);
  }

  update(genre: Genre): Observable<Genre> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.put<Genre>(`${AUTH_API}genres/${genre.id}`, genre, options);
  }

  create(genre: Genre): Observable<Genre> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.post<Genre>(`${AUTH_API}genres`, genre, options);
  }
}