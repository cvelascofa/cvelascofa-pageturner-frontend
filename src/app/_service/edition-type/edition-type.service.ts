import { Injectable } from '@angular/core';
import { EditionType } from '../../models/edition-type/edition-type.model';
import { AUTH_API } from '../../api-constants';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EditionTypeService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<EditionType[]> {
    return this.http.get<EditionType[]>(`${AUTH_API}edition-types`);
  }

  getAllSearchPaginated(name: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = {
      name,
      page: page.toString(),
      size: size.toString()
    };
    return this.http.get<any>(`${AUTH_API}edition-types/search`, { params });
  }

  getById(id: number): Observable<EditionType> {
    return this.http.get<EditionType>(`${AUTH_API}edition-types/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${AUTH_API}edition-types/${id}`);
  }

  update(editionType: EditionType): Observable<EditionType> {
    return this.http.put<EditionType>(`${AUTH_API}edition-types/${editionType.id}`, editionType);
  }

  create(editionType: EditionType): Observable<EditionType> {
    return this.http.post<EditionType>(`${AUTH_API}edition-types`, editionType);
  }
}