import { Injectable } from '@angular/core';
import { EditionType } from '../../models/edition-type/edition-type.model';
import { AUTH_API } from '../../api-constants';
import { Observable } from 'rxjs';
import { HttpClient, HttpFeatureKind, HttpParams } from '@angular/common/http';
import { TokenStorageService } from '../token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EditionTypeService {

  constructor(
    private http: HttpClient,
     private tokenService: TokenStorageService 
  ) { }

  getAll(): Observable<EditionType[]> {
    return this.http.get<EditionType[]>(`${AUTH_API}edition-types`);
  }

  getAllSearchPaginated(name: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());

    const headers = this.tokenService.getAuthHeaders();
    // Aquí extraes los roles desde el TokenStorageService
  const rolesString = this.tokenService.getRoles();
  const roles = rolesString ? JSON.parse(rolesString) : [];

  console.log('Roles del usuario:', roles);

    return this.http.get<any>(`${AUTH_API}edition-types/search`, { params, headers });
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