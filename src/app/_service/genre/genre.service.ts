import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre } from '../../models/genre/genre.model';
import { AUTH_API } from '../../api-constants';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenStorageService
  ) { }

  getAll(): Observable<Genre[]> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.get<Genre[]>(`${AUTH_API}genres`, { headers });
  }

  getAllSearchPaginated(name: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());
    const headers = this.tokenService.getAuthHeaders();
    return this.http.get<any>(`${AUTH_API}genres/search`, { params, headers });
  }
  
  getById(genreId: number): Observable<Genre> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.get<Genre>(`${AUTH_API}genres/${genreId}`, { headers });
  }

  delete(genreId: number): Observable<void> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}genres/${genreId}`, { headers });
  }

  update(genre: Genre): Observable<Genre> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.put<Genre>(`${AUTH_API}genres/${genre.id}`, genre, { headers });
  }

  create(genre: Genre): Observable<Genre> {
    const headers = this.tokenService.getAuthHeaders();
    return this.http.post<Genre>(`${AUTH_API}genres`, genre, { headers });
  }
}