# 🛠️ FixTrack - Plataforma B2B para Talleres de Servicio Técnico

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![.NET Core](https://img.shields.io/badge/.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

**FixTrack** es una plataforma web B2B **Multi-Tenant** diseñada para talleres de servicio técnico (computadoras, celulares, electrónica). Permite a los negocios gestionar sus órdenes de reparación internamente y ofrece a sus clientes finales un portal público para rastrear el estado de sus equipos en tiempo real.

🌐 **Demo en vivo:** [https://fixtrackapp.vercel.app/](https://fixtrackapp.vercel.app/)

---

## 📸 Pantallas de la Aplicación

<img width="1121" height="1244" alt="image" src="https://github.com/user-attachments/assets/8568b76e-1150-4e31-a4cb-b46392345d39" />


---

## 🚀 Arquitectura y Tecnologías

El proyecto ha sido desarrollado aplicando principios de **Clean Architecture**, **Domain-Driven Design (DDD)** y el patrón **CQRS**, garantizando un código escalable, mantenible y altamente cohesionado.

### 💻 Frontend (Client)
- **Framework:** React 18 con TypeScript y Vite.
- **UI/UX:** Material-UI (MUI v6) - Diseño Mobile-First.
- **Despliegue:** Vercel (Sitio estático).

### ⚙️ Backend (API RESTful)
- **Framework:** ASP.NET Core Web API (C# / .NET).
- **Arquitectura:** Clean Architecture / Onion Architecture.
- **Patrones:** Repository Pattern, CQRS (mediante MediatR), Inyección de Dependencias (DI).
- **Seguridad:** JWT (JSON Web Tokens), ASP.NET Core Identity, CORS policies, Hashing de contraseñas.
- **Documentación:** Swagger (OpenAPI).
- **Despliegue:** Contenedor Docker alojado en Render.

### 🗄️ Base de Datos
- **Motor:** PostgreSQL (Alojado en Supabase).
- **Aislamiento de Datos:** Multi-Tenancy real. La base de datos está diseñada estructuralmente para que los tickets y clientes de un taller (Tenant) sean completamente invisibles para otros talleres.

---

## 📦 Funcionalidades Principales (MVP)

### 1. Portal de Cliente (Página Pública)
- Buscador interactivo mediante código único de ticket (ej. `FIX-A1B2C3`).
- Seguimiento en tiempo real del estado del equipo (Recibido, En Diagnóstico, Listo) sin exponer datos sensibles.

### 2. Panel de Control (Dashboard Administrativo)
- **Gestión Multi-Tenant:** Cada taller gestiona su propia data de forma aislada.
- **CRUD de Tickets:** Creación y edición de órdenes (Cliente, Equipo, Problema, Precio).
- **Tabla Inteligente:** Paginación nativa, ordenamiento y buscador en tiempo real.
- **Integración con WhatsApp:** Generación de mensajes dinámicos pre-llenados para notificar al cliente el estado de su equipo con un solo clic.

---

## 🛠️ Instalación y Configuración Local

Si deseas correr este proyecto en tu entorno local, sigue estos pasos:

### Prerrequisitos
- [Node.js](https://nodejs.org/) (v18+)
- [.NET SDK](https://dotnet.microsoft.com/) (v8.0+)
- [PostgreSQL](https://www.postgresql.org/) o una cuenta en Supabase.

### Configuración del Backend (.NET Core)
1. Clona este repositorio:
   ```bash
   git clone [https://github.com/franco-carrion-dev/FixTrackApp.git](https://github.com/franco-carrion-dev/FixTrackApp.git)
