# Frontend Angular — Mis Tareas (TODO List)

Frontend construido en Angular (standalone components) para consumir el backend
Node.js + Express + MongoDB de la actividad de clase (auth JWT + CRUD de tareas).

---

## 📁 Estructura

```
src/
├── app/
│   ├── core/
│   │   ├── models/         → Usuario, Tarea (calcados de los schemas de Mongoose)
│   │   ├── services/       → AuthService, TareaService
│   │   ├── interceptors/   → agrega el JWT a cada petición y maneja sesión expirada
│   │   └── guards/         → authGuard (protege /tareas)
│   ├── shared/
│   │   ├── components/     → layout (navbar), toast (notificaciones)
│   │   └── services/       → NotificacionService
│   └── features/
│       ├── auth/           → login, registro
│       └── tareas/         → listado, formulario (crear/editar)
├── environments/           → URL del backend (dev/prod)
├── index.html, main.ts, styles.css
└── app.component.ts, app.routes.ts, app.config.ts
```

---

## 🚀 Cómo correrlo

### 1. Requisitos
- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`
- Tu backend corriendo (ver su propio README / instrucciones de tu profesor)

### 2. Instalar y correr

```bash
npm install
npm start
```

Esto levanta la app en `http://localhost:4200`.

### 3. Verifica la URL del backend

En `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

Debe coincidir con el `PORT` de tu backend (el tuyo usa `3000`). Si tu backend corre en otro puerto, cámbialo aquí.

---

## 🧪 Cómo probar que todo funciona (paso a paso)

Necesitas **2 terminales abiertas al mismo tiempo**: una para el backend, otra para el frontend.

### Paso 1 — Levanta el backend (Terminal 1)

```bash
cd backend
npm run dev
```

✅ **Debe aparecer:**
```
Conectado correctamente a la base de datos
Conectado correctamente a Node en el puerto: 3000
```
❌ Si ves un error en vez de esto, el problema está en el backend (revisa tu `.env` o que MongoDB esté accesible) — no sigas al paso 2 hasta que esto funcione.

### Paso 2 — Levanta el frontend (Terminal 2, sin cerrar la 1)

```bash
cd frontend
npm install   # solo la primera vez
npm start
```

✅ **Debe aparecer** algo como `Local: http://localhost:4200/` sin errores en rojo.

### Paso 3 — Prueba visualmente en el navegador

1. Ve a `http://localhost:4200` → te manda automáticamente a `/login`
2. Click en **"Regístrate"**, llena el formulario y dale **"Registrarme"**
   - ✅ Éxito: te manda de vuelta a login con un mensaje azul "Cuenta creada correctamente"
   - ❌ Falla: mensaje rojo con el motivo (ej. correo ya existe)
3. Inicia sesión con el correo/contraseña que creaste
   - ✅ Éxito: te lleva a "Mis tareas" (vacía la primera vez)
4. Click en **"+ Nueva tarea"**, escribe título y descripción, dale **"Guardar"**
   - ✅ Éxito: vuelves al listado y ves la tarea **con su descripción visible debajo del título**
5. Click en el **checkbox** de una tarea
   - ✅ Éxito: el texto se tacha y se ve en verde (marcada como completada)
6. Click en **"Editar"**, cambia algo, guarda
   - ✅ Éxito: el cambio se refleja en el listado
7. Click en **"Eliminar"**, confirma
   - ✅ Éxito: la tarea desaparece

Si los 7 pasos funcionan sin mensajes rojos, todo el sistema (backend + frontend) está funcionando de punta a punta.

### Cómo revisar errores si algo falla

Con el navegador abierto, presiona `F12` → pestaña **"Network"** (Red). Cada acción (login, crear tarea, etc.) genera una petición ahí:
- **Rojo** o código `4xx`/`5xx` → click en esa petición → pestaña "Response" → el backend te dice exactamente qué falló
- **Verde** o código `200`/`201` → esa petición funcionó bien

Esto te sirve para depurar y también para explicar en tu sustentación qué pasa entre frontend y backend en cada acción.

---

## 🔗 Cómo se conecta cada pantalla con tu backend

| Pantalla Angular | Endpoint que consume | Archivo del backend |
|---|---|---|
| Registro | `POST /api/auth/registrar` | `controllers/auth.controller.js` → `registrar` |
| Login | `POST /api/auth/login` | `controllers/auth.controller.js` → `login` |
| Listado de tareas | `GET /api/task` | `controllers/task.controller.js` → `traerTareas` |
| Nueva tarea | `POST /api/task` | `controllers/task.controller.js` → `crearTarea` |
| Editar tarea / marcar completada | `PUT /api/task/:id` | `controllers/task.controller.js` → `actualizarTarea` |
| Eliminar tarea | `DELETE /api/task/:id` | `controllers/task.controller.js` → `eliminarTarea` |

El token JWT se guarda en `localStorage` tras el login y se envía en cada petición como header `Authorization: Bearer <token>` — exactamente el formato que espera tu `auth.middleware.js`.

---

## ✅ Nota sobre el campo "descripción" (bug ya corregido)

Originalmente había una inconsistencia: el schema (`models/Task.js`) define el campo como **`descricion`** (sin "p"), pero `crearTarea` guardaba `descripcion` (bien escrito), que Mongoose ignoraba por no existir en el schema — la descripción nunca se guardaba al crear una tarea.

**Esto ya fue corregido** en `task.controller.js` → `crearTarea`, cambiando la propiedad a `descricion` para que coincida con el schema. Por eso el frontend ahora usa un solo formato (`descricion`) tanto al crear como al editar, sin necesidad de manejo especial.

---

## ✅ Qué incluye este frontend

- [x] Registro con los 6 campos reales del modelo `User` (nombre, email, password, edad, sexo, birthday)
- [x] Validación de contraseña fuerte en el formulario (igual que `isStrongPassword()` del backend), para que el usuario no reciba un error 400 sorpresa
- [x] Login con manejo de los 3 posibles errores del backend (usuario no existe, contraseña incorrecta, error de servidor)
- [x] JWT guardado en `localStorage` y enviado automáticamente en cada petición protegida
- [x] Interceptor que detecta sesión inválida/expirada y redirige a login
- [x] Guard que protege las rutas de tareas si no hay token
- [x] Listado de tareas con checkbox para marcar completada al instante
- [x] Crear, editar y eliminar tareas
- [x] Notificaciones tipo "toast" para confirmar acciones (crear, editar, eliminar)
- [x] Diseño simple y responsive, sin dependencias externas de CSS

## 🔜 Lo que no incluye (fuera del alcance de lo que tu backend expone)

- Editar o eliminar el perfil del usuario (tu backend no tiene esos endpoints)
- Recuperar contraseña (no existe esa ruta en tu API)
- Buscar/filtrar tareas por texto o estado (tu `GET /api/task` no acepta query params, siempre trae todas las del usuario)
