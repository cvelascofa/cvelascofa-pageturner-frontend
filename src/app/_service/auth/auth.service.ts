import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_API } from '../../api-constants';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
        email,
        password,
      }, httpOptions
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    const userPayload = {
      username,
      email,
      password,
      role: {
        id: 0,
        name: 'USER',
        description: ''
      }
    };
  
    return this.http.post(
      AUTH_API + 'users',
      userPayload,
      httpOptions
    );
  }
}