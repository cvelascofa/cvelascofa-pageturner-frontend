import { Injectable } from '@angular/core';
import { EditionType } from '../../models/edition-type/edition-type.model';
import { AUTH_API } from '../../api-constants';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthHeaderService } from '../auth-header/auth-header.service';

@Injectable({
  providedIn: 'root'
})
export class EditionTypeService {

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) { }

  getAll(): Observable<EditionType[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<EditionType[]>(`${AUTH_API}edition-types`, options);
  }

  getAllSearchPaginated(name: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());
      const options = this.authHeaderService.getAuthHeadersWithParams(params);
      return this.http.get<any>(`${AUTH_API}edition-types/search`, options);
  }

  getById(id: number): Observable<EditionType> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<EditionType>(`${AUTH_API}edition-types/${id}`, options);
  }

  delete(id: number): Observable<void> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}edition-types/${id}`, options);
  }

  update(editionType: EditionType): Observable<EditionType> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.put<EditionType>(`${AUTH_API}edition-types/${editionType.id}`, editionType, options);
  }

  create(editionType: EditionType): Observable<EditionType> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.post<EditionType>(`${AUTH_API}edition-types`, editionType, options);
  }
}