# Backend — API de Lista de Tareas (TODO List)

API REST construida con **Node.js + Express + MongoDB (Mongoose)**, con autenticación
basada en **JWT**. Permite que cada usuario registre una cuenta y gestione sus propias
tareas (crear, listar, editar, marcar como completadas y eliminar).

---

## 🧰 Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (`jsonwebtoken`) para autenticación
- `bcrypt` para el hash de contraseñas
- `express-validator` para validar los datos de entrada
- `cors` para permitir peticiones desde el frontend
- `dotenv` para variables de entorno

---

## 📁 Estructura del proyecto

```
backend/
├── config/
│   └── db.js                  → conexión a MongoDB
├── controllers/
│   ├── auth.controller.js     → registrar, login
│   └── task.controller.js     → CRUD de tareas
├── middlewares/
│   ├── auth.middleware.js     → valida el JWT (validarToken)
│   └── validate.middleware.js → revisa los errores de express-validator
├── models/
│   ├── User.js                → schema de usuario
│   └── Task.js                → schema de tarea
├── routes/
│   ├── auth.routes.js
│   └── task.routes.js
├── validators/
│   └── auth.validator.js      → reglas de validación de registro/login
├── .env                       → variables de entorno (no se sube al repo)
├── .env.example                → plantilla de las variables necesarias
└── index.js                   → punto de entrada
```

---

## 🚀 Cómo correrlo

### 1. Requisitos
- Node.js 18+
- MongoDB (local o Atlas)

### 2. Instalar dependencias

```bash
cd backend
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz de `backend/` con:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/todo_app
SECRET_KEY=escribe_aqui_un_secreto_largo_y_aleatorio
```

> 💡 Puedes generar un `SECRET_KEY` seguro con:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 4. Levantar el servidor

```bash
npm run dev
```

✅ Deberías ver en consola:
```
Conectado correctamente a la base de datos
Conectado correctamente a Node en el puerto: 3000
```

---

## 🔌 Endpoints de la API

Base URL: `http://localhost:3000/api`

### Auth (`/auth`)

| Método | Ruta | Protegida | Descripción |
|---|---|---|---|
| POST | `/auth/registrar` | No | Crea un nuevo usuario |
| POST | `/auth/login` | No | Autentica y devuelve un JWT |

**Body de `/auth/registrar`:**
```json
{
  "nombre": "Juan Camilo Sánchez",
  "email": "juan@ejemplo.com",
  "password": "Nueva123*",
  "edad": 32,
  "sexo": "masculino",
  "birthday": "1994-09-05"
}
```
La contraseña debe ser fuerte (mayúscula + minúscula + número + símbolo), validado con `express-validator`.

**Body de `/auth/login`:**
```json
{
  "email": "juan@ejemplo.com",
  "password": "Nueva123*"
}
```
**Respuesta exitosa:**
```json
{ "msg": "...", "token": "eyJhbGciOiJIUzI1NiIs..." }
```

### Tareas (`/task`)

Todas requieren el header `Authorization: Bearer <token>` obtenido en el login.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/task` | Lista todas las tareas del usuario autenticado |
| GET | `/task/:id` | Trae una tarea específica (si pertenece al usuario) |
| POST | `/task` | Crea una nueva tarea |
| PUT | `/task/:id` | Actualiza una tarea (título, descripción, `completado`, etc.) |
| DELETE | `/task/:id` | Elimina una tarea |

**Body de `POST /task`:**
```json
{
  "titulo": "Comprar materiales",
  "descripcion": "Ir a la ferretería antes del viernes"
}
```

**Body de `PUT /task/:id`** (cualquier combinación de estos campos):
```json
{
  "titulo": "Nuevo título",
  "descricion": "Nueva descripción",
  "completado": true
}
```

---

## 🗄️ Modelos de datos

### `User`
| Campo | Tipo | Requerido |
|---|---|---|
| nombre | String | Sí |
| email | String (único) | Sí |
| password | String (hasheada con bcrypt) | Sí |
| edad | Number | Sí |
| sexo | String | Sí |
| birthday | Date | Sí |

### `Task`
| Campo | Tipo | Notas |
|---|---|---|
| titulo | String (único) | Requerido |
| completado | Boolean | Default `false` |
| descricion | String | Default `''` (nótese el nombre del campo, sin "p") |
| usuario | ObjectId (ref `User`) | Asociado automáticamente al usuario autenticado |

---

## 🔒 Autenticación

1. El usuario se registra en `/auth/registrar` (contraseña se guarda hasheada con bcrypt)
2. Inicia sesión en `/auth/login` → recibe un JWT firmado con `SECRET_KEY`, válido por 1 hora
3. En cada petición protegida, envía el token como header:
   ```
   Authorization: Bearer <token>
   ```
4. El middleware `auth.middleware.js` valida el token y añade `peticion.user` (con el `id` del usuario) a la petición, que los controllers usan para filtrar las tareas por dueño

---

## 🌐 CORS

El servidor tiene habilitado `cors()` de forma abierta (todos los orígenes), para permitir que el frontend (Angular, típicamente en `localhost:4200`) consuma la API sin bloqueos del navegador. Si se despliega a producción, se recomienda restringir el origen permitido, por ejemplo:

```javascript
app.use(cors({ origin: 'https://tu-dominio-del-frontend.com' }))
```

---

## 🧪 Cómo probar la API sin frontend (con curl)

```bash
# 1. Registro
curl -X POST http://localhost:3000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","email":"ana@test.com","password":"Abc123!","edad":25,"sexo":"femenino","birthday":"2000-01-01"}'

# 2. Login (copia el token de la respuesta)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@test.com","password":"Abc123!"}'

# 3. Crear tarea (reemplaza TU_TOKEN)
curl -X POST http://localhost:3000/api/task \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{"titulo":"Primera tarea","descripcion":"Prueba desde curl"}'

# 4. Listar tareas
curl http://localhost:3000/api/task \
  -H "Authorization: Bearer TU_TOKEN"
```

Si las 4 responden con status `200`/`201` (no `500`/`401`), la API está funcionando correctamente.

---

## 🛠️ Historial de correcciones aplicadas

| # | Problema | Archivo | Solución |
|---|---|---|---|
| 1 | Typo `proccess` en vez de `process`, rompía el login | `controllers/auth.controller.js` | Corregido a `process.env.SECRET_KEY` |
| 2 | Variable `task` (modelo) shadowed por `const task` local dentro de `crearTarea`/`traerTareaporId` | `controllers/task.controller.js` | Modelo renombrado a `Task` (mayúscula) en el import y sus usos |
| 3 | Rutas `PUT`/`DELETE` de tareas sin middleware de autenticación | `routes/task.routes.js` | Se agregó `validarToken` como segundo argumento en ambas rutas |
| 4 | `crearTarea` guardaba el campo como `descripcion`, pero el schema lo define como `descricion` — la descripción nunca se guardaba al crear una tarea | `controllers/task.controller.js` | Se corrigió la propiedad a `descricion` para que coincida con el schema |
| 5 | Sin `cors()` habilitado — el navegador bloqueaba las peticiones del frontend por política de mismo origen | `index.js` | `npm install cors` + `app.use(cors())` |

---

## 📌 Posibles mejoras futuras (no implementadas)

- Endpoint para editar el perfil del propio usuario
- Recuperación de contraseña
- Paginación/búsqueda en el listado de tareas
- Refresh token (actualmente el JWT expira en 1 hora sin renovación automática)
- Restringir CORS a un origen específico en producción
