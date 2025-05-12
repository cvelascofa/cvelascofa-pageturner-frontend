import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthHeaderService } from '../auth-header/auth-header.service';
import { AUTH_API } from '../../api-constants';
import { Role } from '../../models/role/role.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) { }

  getAll(): Observable<Role[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Role[]>(`${AUTH_API}roles`, options);
  }
}