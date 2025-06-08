import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TokenStorageService } from '../../../_service/token-storage/token-storage.service';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../_service/role/role.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit, OnDestroy {

  userRoleName: string;
  roles: string[] = [];
  private rolesSub: Subscription;

  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router,
    private roleService: RoleService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.refreshRoles();

    this.rolesSub = this.tokenStorage.rolesChanged$.subscribe(() => {
      this.refreshRoles();
    });
  }

  ngOnDestroy(): void {
    this.rolesSub?.unsubscribe();
  }

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getToken();
  }

  closeNavbar(): void {
    if (this.navbarCollapse) {
      this.renderer.removeClass(this.navbarCollapse.nativeElement, 'show');
    }
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

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  refreshRoles(): void {
    this.roles = this.tokenStorage.getParsedRoles();
  }

  isLibrarian(): boolean {
    return this.hasRole('LIBRARIAN');
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

}