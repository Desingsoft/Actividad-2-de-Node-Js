import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginPayload, LoginResponse, RegistroPayload } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Coincide con: app.use('/api/auth', auth) en index.js
  private apiUrl = `${environment.apiUrl}/auth`;

  // El backend solo devuelve { msg, token } en el login (no info del usuario),
  // así que solo podemos saber si hay sesión activa o no.
  autenticado = signal<boolean>(this.hayToken());

  constructor(private http: HttpClient, private router: Router) {}

  // Coincide con: router.post('/registrar', registerValidator, validator, registrar)
  registrar(datos: RegistroPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/registrar`, datos);
  }

  // Coincide con: router.post('/login', loginValidator, validator, login)
  login(datos: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, datos).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.autenticado.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.autenticado.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private hayToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
