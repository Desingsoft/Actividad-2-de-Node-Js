import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TareaService } from '../../../core/services/tarea.service';
import { NotificacionService } from '../../../shared/services/notificacion.service';
import { Tarea } from '../../../core/models/tarea.model';

@Component({
  selector: 'app-lista-tareas',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lista-tareas.component.html'
})
export class ListaTareasComponent implements OnInit {
  tareas = signal<Tarea[]>([]);
  cargando = signal(true);

  constructor(
    private tareaService: TareaService,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.cargando.set(true);
    // GET /api/task devuelve el array directo (no { tareas: [...] }),
    // según traerTareas en task.controller.js
    this.tareaService.getTodas().subscribe({
      next: (tareas) => {
        this.tareas.set(tareas);
        this.cargando.set(false);
      },
      error: () => {
        this.notificacionService.error('No se pudieron cargar las tareas');
        this.cargando.set(false);
      }
    });
  }

  toggleCompletado(tarea: Tarea): void {
    this.tareaService.actualizar(tarea._id!, { completado: !tarea.completado }).subscribe({
      next: () => this.cargarTareas(),
      error: () => this.notificacionService.error('No se pudo actualizar la tarea')
    });
  }

  eliminar(tarea: Tarea): void {
    if (!confirm(`¿Eliminar la tarea "${tarea.titulo}"?`)) return;
    this.tareaService.eliminar(tarea._id!).subscribe({
      next: () => {
        this.notificacionService.exito('Tarea eliminada correctamente');
        this.cargarTareas();
      },
      error: () => this.notificacionService.error('No se pudo eliminar la tarea')
    });
  }
}
