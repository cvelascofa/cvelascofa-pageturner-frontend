import { Injectable } from '@angular/core';
import { AUTH_API } from '../../api-constants';
import { Friend } from '../../models/friend/friend.model';
import { Observable } from 'rxjs';
import { AuthHeaderService } from '../auth-header/auth-header.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) { }

  sendFriendRequest(friend: Friend): Observable<string> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.post<string>(`${AUTH_API}friends/request`, friend, options);
  }
  
  acceptFriendRequest(senderId: number, recipientId: number): Observable<string> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.put<string>(`${AUTH_API}friends/accept/${senderId}/${recipientId}`, null, options);
  }
  
  rejectFriendRequest(senderId: number, recipientId: number): Observable<void> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}friends/reject/${senderId}/${recipientId}`, options);
  }

  getPendingFriendRequests(): Observable<Friend[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Friend[]>(`${AUTH_API}friends/requests/pending`, options);
  }

  getAcceptedFriends(): Observable<Friend[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Friend[]>(`${AUTH_API}friends`, options);
  }

  getReceivedRequests(): Observable<Friend[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Friend[]>(`${AUTH_API}friends/requests/received`, options);
  }
  
  getSentRequests(): Observable<Friend[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Friend[]>(`${AUTH_API}friends/requests/sent`, options);
  }
  
}