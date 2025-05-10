import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReadingStatus } from '../../models/reading-status/reading-status.model';
import { HttpClient } from '@angular/common/http';
import { AUTH_API } from '../../api-constants';
import { AuthHeaderService } from '../auth-header/auth-header.service';

@Injectable({
  providedIn: 'root'
})
export class ReadingStatusService {
  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {}

  getAll(): Observable<ReadingStatus[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<ReadingStatus[]>(`${AUTH_API}reading-status`, options);
  }

  getByCode(code: string): Observable<ReadingStatus> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<ReadingStatus>(`${AUTH_API}reading-status/code/${code}`, options);
  }
}