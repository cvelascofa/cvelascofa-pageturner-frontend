import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStorageService } from '../_service/token-storage/token-storage.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data['roles'];
  const user = tokenStorage.getUser();

  if (!user || !user.roles) {
    router.navigate(['/login']);
    return false;
  }

  const hasRole = user.roles.some((role: string) => expectedRoles.includes(role));

  if (!hasRole) {
    router.navigate(['/']);
    return false;
  }

  return true;
};