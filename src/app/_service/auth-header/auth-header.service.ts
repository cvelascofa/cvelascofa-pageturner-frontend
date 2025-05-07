import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenStorageService } from '../token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHeaderService {

  constructor(private tokenService: TokenStorageService) {}

  getAuthHeaders(): { headers?: HttpHeaders } {
    const token = this.tokenService.getToken();
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return { headers };
    }
    return {}; 
  }

  getAuthHeadersWithParams(params?: HttpParams): { headers?: HttpHeaders, params?: HttpParams } {
    const options: { headers?: HttpHeaders, params?: HttpParams } = {};
    const token = this.tokenService.getToken();

    if (token) {
      options.headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }

    if (params) {
      options.params = params;
    }

    return options;
  }
}
