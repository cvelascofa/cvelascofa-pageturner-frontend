import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthHeaderService } from '../auth-header/auth-header.service';
import { Observable } from 'rxjs';
import { AUTH_API } from '../../api-constants';
import { UserChallenge } from '../../models/challenge/user-challenge.model';

@Injectable({
  providedIn: 'root'
})
export class UserChallengeService {

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) { }

  getAllByUserId(userId: number): Observable<UserChallenge[]> {
    const params = new HttpParams().set('userId', userId.toString());
    const options = this.authHeaderService.getAuthHeadersWithParams(params);
    return this.http.get<UserChallenge[]>(`${AUTH_API}user-challenges`, options);
  }

  create(userChallenge: UserChallenge): Observable<UserChallenge> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.post<UserChallenge>(`${AUTH_API}user-challenges`, userChallenge, options);
  }

  getUserChallengesWithBadges(
    userId: number,
    page: number = 0,
    size: number = 4,
    sort: string = 'desc'
  ): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    const options = this.authHeaderService.getAuthHeadersWithParams(params);
    return this.http.get<any>(`${AUTH_API}user-challenges/badges`, options);
  }

  hasUserCompletedChallenge(userId: number, challengeId: number): Observable<boolean> {
    const url = `${AUTH_API}user-challenges/users/${userId}/challenges/${challengeId}/status`;
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<boolean>(url, options);
  }

}