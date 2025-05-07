import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_API } from '../../api-constants';
import { Language } from '../../models/language/language.model';
import { AuthHeaderService } from '../auth-header/auth-header.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) { }

  getAll(): Observable<Language[]> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Language[]>(`${AUTH_API}languages`, options);
  }

  getAllSearchPaginated(name: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());
      const options = this.authHeaderService.getAuthHeadersWithParams(params);
      return this.http.get<any>(`${AUTH_API}languages/search`, options);
  }

  getById(languageId: number): Observable<Language> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.get<Language>(`${AUTH_API}languages/${languageId}`, options);
  }
  
  delete(languageId: number): Observable<void> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}languages/${languageId}`, options);
  }

  update(language: Language): Observable<Language> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.put<Language>(`${AUTH_API}languages/${language.id}`, language, options);
  }

  create(language: Language): Observable<Language> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.post<Language>(`${AUTH_API}languages`, language, options);
  }
}