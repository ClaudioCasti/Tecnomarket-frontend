import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { authGuard, roleGuard } from './auth.guard';

const route = {} as ActivatedRouteSnapshot;
const state = {} as RouterStateSnapshot;

function configurar(autenticado: boolean, grupos: string[] = []) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      {
        provide: AuthService,
        useValue: { isAuthenticated: () => autenticado, hasRole: (r: string) => grupos.includes(r) },
      },
    ],
  });
  return TestBed.inject(Router);
}

describe('guards', () => {
  it('authGuard deja pasar a un usuario autenticado', () => {
    configurar(true);
    expect(TestBed.runInInjectionContext(() => authGuard(route, state))).toBe(true);
  });

  it('authGuard redirige al inicio con aviso si no hay sesión', () => {
    const router = configurar(false);
    const resultado = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(resultado instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(resultado as UrlTree)).toBe('/?aviso=login');
  });

  it('roleGuard permite el acceso al grupo admin', () => {
    configurar(true, ['admin']);
    expect(TestBed.runInInjectionContext(() => roleGuard('admin')(route, state))).toBe(true);
  });

  it('roleGuard bloquea a un usuario sin el grupo requerido', () => {
    const router = configurar(true, ['cliente']);
    const resultado = TestBed.runInInjectionContext(() => roleGuard('admin')(route, state));

    expect(router.serializeUrl(resultado as UrlTree)).toBe('/?aviso=rol');
  });
});
