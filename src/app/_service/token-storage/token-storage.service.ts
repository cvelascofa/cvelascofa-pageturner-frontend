import { Injectable } from '@angular/core';
import {  TOKEN_KEY, USER_KEY, USER_ROLES_KEY } from '../../api-constants';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(
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
    
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
}