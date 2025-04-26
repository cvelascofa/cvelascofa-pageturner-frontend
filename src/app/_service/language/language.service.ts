import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_API } from '../../api-constants';
import { Language } from '../../models/language/language.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Language[]> {
    return this.http.get<Language[]>(`${AUTH_API}languages`);
  }

  getAllSearchPaginated(name: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = {
      name,
      page: page.toString(),
      size: size.toString()
    };
    return this.http.get<any>(`${AUTH_API}languages/search`, { params });
  }

  getById(languageId: number): Observable<Language> {
    return this.http.get<Language>(`${AUTH_API}languages/${languageId}`);
  }

  delete(languageId: number): Observable<void> {
    return this.http.delete<void>(`${AUTH_API}languages/${languageId}`);
  }

  update(language: Language): Observable<Language> {
    return this.http.put<Language>(`${AUTH_API}languages/${language.id}`, language);
  }

  create(language: Language): Observable<Language> {
    return this.http.post<Language>(`${AUTH_API}languages`, language);
  }
}