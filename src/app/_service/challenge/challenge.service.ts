import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthHeaderService } from '../auth-header/auth-header.service';
import { Observable } from 'rxjs';
import { Challenge } from '../../models/challenge/challenge.model';
import { AUTH_API } from '../../api-constants';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) { }

  getAll(): Observable<Challenge[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Challenge[]>(`${AUTH_API}challenges`, options);
  }

  getById(id: number): Observable<Challenge> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Challenge>(`${AUTH_API}challenges/${id}`, options);
  }

  create(challenge: Challenge): Observable<Challenge> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.post<Challenge>(`${AUTH_API}challenges`, challenge, options);
  }

  update(challenge: Challenge): Observable<Challenge> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.put<Challenge>(`${AUTH_API}challenges/${challenge.id}`, challenge, options);
  }

  delete(id: number): Observable<void> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}challenges/${id}`, options);
  }

}