import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AUTH_API, TOKEN_KEY, USER_KEY, USER_ROLES_KEY } from '../../api-constants';
import { Observable } from 'rxjs';
import { User } from '../../models/user/user.model';
import { AuthHeaderService } from '../auth-header/auth-header.service';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(
    private authService: AuthService, 
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {  }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: any): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token.token);
  }
  
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }
  

  public getRoles(): string | null {
    return window.sessionStorage.getItem(USER_ROLES_KEY);
  }
  
  public saveRoles(roles: any): void {
    window.sessionStorage.removeItem(USER_ROLES_KEY);
    window.sessionStorage.setItem(USER_ROLES_KEY, JSON.stringify(roles));
  }

  public async saveUser(email:string): Promise<void>  {
    try {
      const user = await this.getUserByEmail(email).toPromise();
      window.sessionStorage.removeItem(USER_KEY);
      window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error fetching user by email: ', error);
      throw error;
    }
  }
    
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  getUserByEmail(email: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${AUTH_API}users/email/${email}`, { headers });
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

  getAllUsers(): Observable<any[]> {
    const headers = this.getAuthHeaders();
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
  
}