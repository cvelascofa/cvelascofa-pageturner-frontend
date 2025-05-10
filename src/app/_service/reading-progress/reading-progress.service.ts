import { Injectable } from '@angular/core';
import { AUTH_API } from '../../api-constants';
import { ReadingProgress } from '../../models/reading-progress/reading-progress.model';
import { Observable } from 'rxjs';
import { AuthHeaderService } from '../auth-header/auth-header.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReadingProgressService {

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {}

  create(progressData: ReadingProgress): Observable<ReadingProgress> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.post<ReadingProgress>(`${AUTH_API}reading-progress/`, progressData, options);
  }

  getProgress(userId: number, bookId: number): Observable<ReadingProgress> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<ReadingProgress>(`${AUTH_API}reading-progress/${userId}/${bookId}`, options);
  }

  update(userId: number, bookId: number, progressData: ReadingProgress): Observable<ReadingProgress> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.put<ReadingProgress>(`${AUTH_API}reading-progress/${userId}/${bookId}`, progressData, options);
  }

  delete(userId: number, bookId: number): Observable<void> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}reading-progress/${userId}/${bookId}`, options);
  }
}