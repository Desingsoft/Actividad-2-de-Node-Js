import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  cargando = signal(false);
  errorMsg = signal('');

  registroForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
    ]],
    edad: [null as number | null, [Validators.required, Validators.min(0)]],
    sexo: ['masculino', Validators.required],
    birthday: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.registroForm.invalid) return;

    this.cargando.set(true);
    this.errorMsg.set('');

    this.authService.registrar(this.registroForm.value as any).subscribe({
      next: () => {
        this.router.navigate(['/login'], { queryParams: { registrado: 'true' } });
      },
      error: (err) => {
        const mensaje = err.error?.msg
          || err.error?.errors?.[0]?.msg
          || 'Error al registrar el usuario';
        this.errorMsg.set(mensaje);
        this.cargando.set(false);
      }
    });
  }
}
