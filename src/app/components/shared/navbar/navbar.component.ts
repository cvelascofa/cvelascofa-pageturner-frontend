import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TokenStorageService } from '../../../_service/token-storage/token-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getToken();
  }

  getUsername(): string {
    const user = this.tokenStorage.getUser();
    return user?.username || 'Usuario';
  }

  getLoggedUserId(): number | null {
    const user = this.tokenStorage.getUser();
    return user?.id || null;
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['/login']);
  }

  getAvatarUrl(): string {
    const username = this.getUsername() || 'Anonymous';
    const encodedName = encodeURIComponent(username);
    return `https://ui-avatars.com/api/?background=random&name=${encodedName}`;
  }
}