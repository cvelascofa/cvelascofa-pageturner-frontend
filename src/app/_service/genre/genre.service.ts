import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre } from '../../models/genre/genre.model';
import { AUTH_API } from '../../api-constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Genre[]> {
        return this.http.get<Genre[]>(`${AUTH_API}genres`);
    }
  
  getById(genreId: number): Observable<Genre> {
      return this.http.get<Genre>(`${AUTH_API}genres/${genreId}`);
  }

  delete(genreId: number): Observable<void> {
    return this.http.delete<void>(`${AUTH_API}genres/${genreId}`);
  }

  update(genre: Genre): Observable<Genre> {
    return this.http.put<Genre>(`${AUTH_API}genres/${genre.id}`, genre);
  }
}