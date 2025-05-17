# 🧬 Sistema de Salud y Nutrición

Este sistema web permite registrar pacientes, calcular IMC y visualizar información de salud y nutrición tanto para niños como adultos. Incluye autenticación segura, registro de usuarios y conexión a una base de datos MySQL. Desarrollado con tecnologías modernas y Dockerizado para facilitar su despliegue.

---

## 🧰 Tecnologías utilizadas

- ⚛️ **Frontend:** React + Vite + NextUI
- 🚀 **Backend:** NestJS + TypeORM + JWT + MySQL
- 🐳 **Contenedores:** Docker & Docker Compose
- 🔐 **Autenticación:** JWT (Token-based)
- 🧪 **Validación:** class-validator / DTOs

---

## 🗂️ Estructura del proyecto

```
saldu-y-nutricion/
├── backend/           # API NestJS con Auth, Pacientes, etc.
├── Front/             # Frontend en React + Vite
├── mysql/             # Volumen persistente de base de datos
├── docker-compose.yml
└── .env               # Variables de entorno del backend
```

---

## 🚀 ¿Cómo correr el sistema?

### ✅ 1. Requisitos

- Docker & Docker Compose instalados
- Puerto `3000` (backend), `5173` (frontend) y `3307` (MySQL) libres

---

### 📦 2. Clona el proyecto

```bash
git clone https://github.com/tuusuario/saldu-y-nutricion.git
cd saldu-y-nutricion
```

---

### ⚙️ 3. Crea el archivo `.env`

Dentro de la raíz del proyecto:

```env
DB_HOST=db
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=nutricion
JWT_SECRET=ultrasecretosano2025
```

---

### 🐳 4. Levanta todo con Docker Compose

```bash
docker compose up --build
```

Esto levanta:

- MySQL en `localhost:3307`
- Backend NestJS en `localhost:3000`
- Frontend React en `localhost:5173`

---

### ✅ 5. Abre en el navegador

```bash
http://localhost:5173
```

Desde ahí puedes:

- Registrar un nuevo usuario
- Iniciar sesión
- Acceder a formularios de nutrición
- Calcular IMC
- Ver percentiles

---

## 👩‍🔬 Usuario demo

Al arrancar, se crea un usuario automáticamente:

```bash
Email: demo@demo.com
Password: 123456
```

---

## 🛠️ Comandos útiles

### Logs del backend:
```bash
docker compose logs -f backend
```

### Parar todo:
```bash
docker compose down
```

---

## 📌 Consideraciones

- El backend está protegido con JWT y validaciones de DTO
- El frontend valida formularios antes de enviar
- Todos los servicios se comunican en red Docker interna
- CORS está configurado para desarrollo

---

## 🤝 Autores

- 👩‍💻 Nataly Itzel Barrera Salgado
- 👨‍💻 Colaboradores: AGREGAR NOMBRES

---

## 📜 Licencia

MIT © 2025
