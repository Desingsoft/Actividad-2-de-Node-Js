// Calca los campos de backend/models/User.js
export interface Usuario {
  nombre: string;
  email: string;
  password: string;
  edad: number;
  sexo: 'masculino' | 'femenino' | 'otro';
  birthday: string; // formato yyyy-mm-dd
}

// Lo que espera POST /api/auth/registrar (mismos campos que el modelo)
export type RegistroPayload = Usuario;

// Lo que espera POST /api/auth/login
export interface LoginPayload {
  email: string;
  password: string;
}

// Lo que devuelve el login según auth.controller.js: { msg, token }
export interface LoginResponse {
  msg: string;
  token: string;
}
