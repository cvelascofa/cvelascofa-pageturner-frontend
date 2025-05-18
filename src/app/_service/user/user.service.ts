import { Injectable } from '@angular/core';
import { AUTH_API, USER_KEY } from '../../api-constants';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthHeaderService } from '../auth-header/auth-header.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) { }

  getUserByEmail(email: string): Observable<any> {
    const headers = this.authHeaderService.getAuthHeaders().headers;
    return this.http.get(`${AUTH_API}users/email/${email}`, { headers });
  }

  getAllUsers(): Observable<any[]> {
    const headers = this.authHeaderService.getAuthHeaders().headers;
    return this.http.get<any[]>(`${AUTH_API}users`, { headers });
  }

  getAllSearchPaginated(username: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('page', page.toString())
      .set('size', size.toString());
    const options = this.authHeaderService.getAuthHeadersWithParams(params);
    return this.http.get<any>(`${AUTH_API}users/search`, options);
  }

  getSearchCandidates(username: string): Observable<any[]> {
    const params = new HttpParams().set('username', username);
    const options = this.authHeaderService.getAuthHeadersWithParams(params);
    return this.http.get<any[]>(`${AUTH_API}users/search/friends/candidates`, options);
  }

  public async save(email:string): Promise<void>  {
    try {
      const user = await this.getUserByEmail(email).toPromise();
      window.sessionStorage.removeItem(USER_KEY);
      window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error fetching user by email: ', error);
      throw error;
    }
  }

  getUserById(id: number): Observable<any> {
    const headers = this.authHeaderService.getAuthHeaders().headers;
    return this.http.get(`${AUTH_API}users/${id}`, { headers });
  }
}