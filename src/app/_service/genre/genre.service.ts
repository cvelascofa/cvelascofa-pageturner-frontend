import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre } from '../../models/genre/genre.model';
import { AUTH_API } from '../../api-constants';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(
    private http: HttpClient
  ) { }

  getAllBooks(): Observable<Genre[]> {
        return this.http.get<Genre[]>(`${AUTH_API}genres`);
    }
  
    getById(bookId: number): Observable<Genre> {
        return this.http.get<Genre>(`${AUTH_API}genres/${bookId}`);
    }
}
