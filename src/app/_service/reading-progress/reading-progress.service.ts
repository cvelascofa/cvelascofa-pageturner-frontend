import { Injectable } from '@angular/core';
import { AUTH_API } from '../../api-constants';
import { ReadingProgress } from '../../models/reading-progress/reading-progress.model';
import { Observable } from 'rxjs';
import { AuthHeaderService } from '../auth-header/auth-header.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReadingProgressService {

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) { }

  create(progressData: ReadingProgress): Observable<ReadingProgress> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.post<ReadingProgress>(`${AUTH_API}reading-progress/`, progressData, options);
  }

  getProgress(userId: number, bookId: number): Observable<ReadingProgress[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<ReadingProgress[]>(`${AUTH_API}reading-progress/${userId}/${bookId}`, options);
  }

  update(id: number, progressData: ReadingProgress): Observable<ReadingProgress> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.put<ReadingProgress>(`${AUTH_API}reading-progress/${id}`, progressData, options);
  }

  delete(id: number): Observable<void> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}reading-progress/${id}`, options);
  }

  getAllPaginatedByUserAndBook(
    userId: number,
    bookId: number,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'progressDate',
    sortDir: string = 'desc'
  ): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    const options = this.authHeaderService.getAuthHeadersWithParams(params);
    return this.http.get<any>(`${AUTH_API}reading-progress/paginated/${userId}/${bookId}`, options);
  }


}