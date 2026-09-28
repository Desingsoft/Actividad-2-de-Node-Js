import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegistroComponent } from './features/auth/registro/registro.component';
import { ListaTareasComponent } from './features/tareas/lista-tareas/lista-tareas.component';
import { FormTareaComponent } from './features/tareas/form-tarea/form-tarea.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'tareas', pathMatch: 'full' },
      { path: 'tareas', component: ListaTareasComponent },
      // "nueva" debe ir antes que ":id" para que el router no lo confunda con un id
      { path: 'tareas/nueva', component: FormTareaComponent },
      { path: 'tareas/editar/:id', component: FormTareaComponent }
    ]
  },

  { path: '**', redirectTo: 'tareas' }
];
