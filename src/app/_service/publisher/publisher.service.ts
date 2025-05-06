import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_API } from '../../api-constants';
import { Publisher } from '../../models/publisher/publisher.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TokenStorageService } from '../token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  constructor(private http: HttpClient, private tokenService: TokenStorageService) { }

  getAll(): Observable<Publisher[]> {
    return this.http.get<Publisher[]>(`${AUTH_API}publishers`);
  }

  getAllSearchPaginated(name: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());

    const headers = this.tokenService.getAuthHeaders();

    return this.http.get<any>(`${AUTH_API}publishers/search`, { params, headers });
  }

  getById(publisherId: number): Observable<Publisher> {
    return this.http.get<Publisher>(`${AUTH_API}publishers/${publisherId}`);
  }

  create(publisher: Publisher): Observable<Publisher> {
    return this.http.post<Publisher>(`${AUTH_API}publishers`, publisher);
  }

  update(publisher: Publisher): Observable<Publisher> {
    return this.http.put<Publisher>(`${AUTH_API}publishers/${publisher.id}`, publisher);
  }

  delete(publisherId: number): Observable<void> {
    return this.http.delete<void>(`${AUTH_API}publishers/${publisherId}`);
  }
}