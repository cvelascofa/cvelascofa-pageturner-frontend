import { Injectable } from '@angular/core';
import { TOKEN_KEY, USER_KEY, USER_ROLES_KEY } from '../../api-constants';
import { Subject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(
  ) { }

  private rolesChanged = new Subject<void>();
  rolesChanged$ = this.rolesChanged.asObservable();

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
    this.rolesChanged.next();
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getParsedRoles(): string[] {
  const rolesString = window.sessionStorage.getItem(USER_ROLES_KEY);
  if (!rolesString) return [];
  try {
    const roles = JSON.parse(rolesString);
    if (Array.isArray(roles) && typeof roles[0] === 'string') {
      return roles;
    }
    if (Array.isArray(roles) && roles[0]?.name) {
      return roles.map(r => r.name);
    }
    return [];
  } catch {
    return [];
  }
}
}