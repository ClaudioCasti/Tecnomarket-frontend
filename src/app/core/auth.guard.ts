import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Exige sesión iniciada; si no, vuelve al inicio con un aviso. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() || router.createUrlTree(['/'], { queryParams: { aviso: 'login' } });
};

/** Exige además pertenecer a un grupo de Cognito (claim "cognito:groups"). */
export const roleGuard =
  (rol: string): CanActivateFn =>
  () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (!auth.isAuthenticated()) {
      return router.createUrlTree(['/'], { queryParams: { aviso: 'login' } });
    }
    return auth.hasRole(rol) || router.createUrlTree(['/'], { queryParams: { aviso: 'rol' } });
  };
