import { HttpInterceptorFn } from '@angular/common/http';
import { fetchAuthSession } from 'aws-amplify/auth';
import { from, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Adjunta el access token (Bearer) SOLO a las llamadas hacia el API Gateway propio.
 * Las peticiones a cualquier otro dominio no reciben el token.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }
  return from(fetchAuthSession().catch(() => null)).pipe(
    switchMap((session) => {
      const token = session?.tokens?.accessToken?.toString();
      return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
    }),
  );
};
