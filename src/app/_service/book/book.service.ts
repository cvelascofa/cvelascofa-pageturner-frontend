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

  getAllBooks(): Observable<Book[]> {
    console.log(`${AUTH_API}books`);
      return this.http.get<Book[]>(`${AUTH_API}books`);
  }
}
