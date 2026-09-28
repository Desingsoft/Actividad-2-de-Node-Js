import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cargando = signal(false);
  errorMsg = signal('');
  mensajeInfo = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['sesionExpirada']) {
      this.mensajeInfo.set('Tu sesión expiró. Vuelve a iniciar sesión.');
    }
    if (this.route.snapshot.queryParams['registrado']) {
      this.mensajeInfo.set('Cuenta creada correctamente. Ahora inicia sesión.');
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.cargando.set(true);
    this.errorMsg.set('');

    this.authService.login(this.loginForm.value as any).subscribe({
      next: () => {
        this.router.navigate(['/tareas']);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.msg || 'Error al iniciar sesión');
        this.cargando.set(false);
      }
    });
  }
}
