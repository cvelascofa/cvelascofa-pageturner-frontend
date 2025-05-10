import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthHeaderService } from '../auth-header/auth-header.service';
import { Favourite } from '../../models/favourite/favourite.model';
import { Observable } from 'rxjs';
import { AUTH_API } from '../../api-constants';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {}

  getAllByUserId(userId: number): Observable<Favourite[]> {
    const params = new HttpParams().set('userId', userId.toString());
    const options = this.authHeaderService.getAuthHeadersWithParams(params);
    return this.http.get<Favourite[]>(`${AUTH_API}favourites`, options);
  }

  create(favourite: Favourite): Observable<Favourite> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.post<Favourite>(`${AUTH_API}favourites`, favourite, options);
  }

  delete(favouriteId: number): Observable<void> {
    const options = this.authHeaderService.getAuthHeaders();
    return this.http.delete<void>(`${AUTH_API}favourites/${favouriteId}`, options);
  }

}