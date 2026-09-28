import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tarea, TareaPayload } from '../models/tarea.model';

@Injectable({ providedIn: 'root' })
export class TareaService {
  // Coincide con: app.use('/api/task', task) en index.js
  private apiUrl = `${environment.apiUrl}/task`;

  constructor(private http: HttpClient) {}

  // GET /api/task  →  traerTareas (filtra por peticion.user.id automáticamente en el backend)
  getTodas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }

  // GET /api/task/:id  →  traerTareaporId
  getPorId(id: string): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.apiUrl}/${id}`);
  }

  // POST /api/task  →  crearTarea
  crear(tarea: TareaPayload): Observable<{ task: Tarea }> {
    return this.http.post<{ task: Tarea }>(this.apiUrl, tarea);
  }

  // PUT /api/task/:id  →  actualizarTarea (acepta cualquier campo del body, ej. { completado: true })
  actualizar(id: string, cambios: Partial<TareaPayload & { completado: boolean }>): Observable<{ task: Tarea }> {
    return this.http.put<{ task: Tarea }>(`${this.apiUrl}/${id}`, cambios);
  }

  // DELETE /api/task/:id  →  eliminarTarea
  eliminar(id: string): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/${id}`);
  }
}
