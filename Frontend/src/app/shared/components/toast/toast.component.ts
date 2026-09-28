import { Component } from '@angular/core';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (toast of notificacionService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.tipo" (click)="notificacionService.cerrar(toast.id)">
          {{ toast.mensaje }}
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 1000;
    }
    .toast {
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      color: white;
      font-size: 0.9rem;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      min-width: 220px;
    }
    .toast-exito { background: #22c55e; }
    .toast-error { background: #ef4444; }
    .toast-info { background: #3b82f6; }
  `]
})
export class ToastComponent {
  constructor(public notificacionService: NotificacionService) {}
}
