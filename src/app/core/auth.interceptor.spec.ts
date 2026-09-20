import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
    });
  });

  it('no agrega el token a peticiones hacia otros dominios', () => {
    const http = TestBed.inject(HttpClient);
    const controller = TestBed.inject(HttpTestingController);

    http.get('https://otro-sitio.example.com/datos').subscribe();

    const req = controller.expectOne('https://otro-sitio.example.com/datos');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('sin sesión iniciada, la llamada a la API sale sin Authorization (no se rompe)', async () => {
    const http = TestBed.inject(HttpClient);
    const controller = TestBed.inject(HttpTestingController);

    const url = `${environment.apiUrl}/api/pedidos`;
    http.get(url).subscribe();

    // El interceptor consulta primero la sesión de Amplify (asíncrono): se espera a que salga la petición.
    await new Promise((resolver) => setTimeout(resolver, 200));

    const req = controller.expectOne(url);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });
});
