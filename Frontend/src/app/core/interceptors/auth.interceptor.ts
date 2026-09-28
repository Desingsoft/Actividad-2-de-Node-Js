import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // El backend lee el header así (auth.middleware.js):
  // const token = peticion.header('Authorization').split(' ')[1]
  // por eso el formato debe ser exactamente "Bearer <token>".
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      // El middleware de tu backend responde 401 cuando no hay token,
      // y 500 cuando el token es inválido/expiró (por el catch genérico
      // de jwt.verify). Cubrimos ambos casos para cerrar sesión.
      const esErrorDeToken =
        error.status === 401 ||
        (error.status === 500 && error.error?.msg?.includes('Token no valido'));

      if (esErrorDeToken && !req.url.includes('/auth/login')) {
        authService.logout();
        router.navigate(['/login'], { queryParams: { sesionExpirada: 'true' } });
      }
      return throwError(() => error);
    })
  );
};
