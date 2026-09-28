import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TareaService } from '../../../core/services/tarea.service';
import { NotificacionService } from '../../../shared/services/notificacion.service';

@Component({
  selector: 'app-form-tarea',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-tarea.component.html'
})
export class FormTareaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tareaService = inject(TareaService);
  private notificacionService = inject(NotificacionService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  tareaId = signal<string | null>(null);
  esEdicion = signal(false);
  cargando = signal(false);
  errorMsg = signal('');

  tareaForm = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tareaId.set(id);
      this.esEdicion.set(true);
      this.cargarTarea(id);
    }
  }

  cargarTarea(id: string): void {
    this.cargando.set(true);
    this.tareaService.getPorId(id).subscribe({
      next: (tarea) => {
        this.tareaForm.patchValue({
          titulo: tarea.titulo,
          descripcion: tarea.descricion
        });
        this.cargando.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudo cargar la tarea');
        this.cargando.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.tareaForm.invalid) return;

    this.cargando.set(true);
    const { titulo, descripcion } = this.tareaForm.value;
    const payload = { titulo: titulo!, descricion: descripcion || '' };

    const operacion = this.esEdicion()
      ? this.tareaService.actualizar(this.tareaId()!, payload)
      : this.tareaService.crear(payload as any);

    operacion.subscribe({
      next: () => {
        this.notificacionService.exito(this.esEdicion() ? 'Tarea actualizada correctamente' : 'Tarea creada correctamente');
        this.router.navigate(['/tareas']);
      },
      error: (err) => {
        const accion = this.esEdicion() ? 'actualizar' : 'crear';
        this.errorMsg.set(err.error?.msg || `Error al ${accion} la tarea`);
        this.cargando.set(false);
      }
    });
  }
}
