import { Injectable } from '@angular/core';
import { AuthHeaderService } from '../auth-header/auth-header.service';
import { HttpClient } from '@angular/common/http';
import { UserStatistics } from '../../models/user/user-statistics.model';
import { Observable } from 'rxjs';
import { AUTH_API } from '../../api-constants';

@Injectable({
  providedIn: 'root'
})
export class UserStatisticsService {

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) { }

  getStatisticsByUserId(userId: number): Observable<UserStatistics> {
    const headers = this.authHeaderService.getAuthHeaders().headers;
    return this.http.get<UserStatistics>(`${AUTH_API}users/${userId}/statistics`, { headers });
  }

}