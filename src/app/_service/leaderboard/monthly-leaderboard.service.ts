import { Injectable } from '@angular/core';
import { MonthlyLeaderboard } from '../../models/user/monthly-leaderboard.model';
import { AUTH_API } from '../../api-constants';
import { Observable } from 'rxjs';
import { AuthHeaderService } from '../auth-header/auth-header.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class MonthlyLeaderboardService {

   constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {}

  getCurrentMonthLeaderboard(): Observable<MonthlyLeaderboard[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<MonthlyLeaderboard[]>(`${AUTH_API}monthly-leaderboards/current`, options);
  }

  getByMonthAndYear(month: number, year: number): Observable<MonthlyLeaderboard[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<MonthlyLeaderboard[]>(`${AUTH_API}monthly-leaderboards?month=${month}&year=${year}`, options);
  }

}