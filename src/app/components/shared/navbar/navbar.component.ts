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
  ) {}

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getToken();
  }

  getUsername(): string {
    const user = this.tokenStorage.getUser();
    return user?.username || 'Usuario';
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['/login']);
  }
}