import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_API } from '../../api-constants';
import { Publisher } from '../../models/publisher/publisher.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TokenStorageService } from '../token-storage/token-storage.service';
import { AuthHeaderService } from '../auth-header/auth-header.service';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) { }

  getAll(): Observable<Publisher[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Publisher[]>(`${AUTH_API}publishers`, options);
  }

  getAllSearchPaginated(name: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());
      const options = this.authHeaderService.getAuthHeadersWithParams(params);
      return this.http.get<any>(`${AUTH_API}publishers/search`, options);
  }
  getById(publisherId: number): Observable<Publisher> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Publisher>(`${AUTH_API}publishers/${publisherId}`, options);
  }

  create(publisher: Publisher): Observable<Publisher> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.post<Publisher>(`${AUTH_API}publishers`, publisher, options);
  }

  update(publisher: Publisher): Observable<Publisher> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.put<Publisher>(`${AUTH_API}publishers/${publisher.id}`, publisher, options);
  }

  delete(publisherId: number): Observable<void> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}publishers/${publisherId}`, options);
  }
}