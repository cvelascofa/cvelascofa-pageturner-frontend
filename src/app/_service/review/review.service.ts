import { Injectable } from '@angular/core';
import { Review } from '../../models/review/review.model';
import { AUTH_API } from '../../api-constants';
import { Observable } from 'rxjs';
import { AuthHeaderService } from '../auth-header/auth-header.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {}

  create(review: Review): Observable<Review> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.post<Review>(`${AUTH_API}reviews/`, review, options);
  }

  getAll(): Observable<Review[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Review[]>(`${AUTH_API}reviews/`, options);
  }

  getByUserAndBook(userId: number, bookId: number): Observable<Review> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Review>(`${AUTH_API}reviews/${userId}/${bookId}`, options);
  }

  update(review: Review): Observable<Review> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.put<Review>(
      `${AUTH_API}reviews/${review.userId}/${review.bookId}`,
      review,
      options
    );
  }

  delete(userId: number, bookId: number): Observable<void> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}reviews/${userId}/${bookId}`, options);
  }

  getByBookId(bookId: number): Observable<Review[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Review[]>(`${AUTH_API}reviews/book/${bookId}`, options);
  }
}