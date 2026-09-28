// Calca los campos de backend/models/Task.js
export interface Tarea {
  _id?: string;
  titulo: string;
  completado?: boolean;
  descricion?: string;
  usuario?: string;
}

// Payload para crear/editar (ya corregido en el backend: crearTarea guarda
// "descricion" igual que actualizarTarea, así que el frontend usa un solo formato).
export interface TareaPayload {
  titulo: string;
  descricion?: string;
}
