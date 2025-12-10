# Sistema de Caja Registradora

Sistema profesional de gestión de caja diseñado específicamente para barberías y pequeños negocios, con enfoque en simplicidad, eficiencia y control detallado.

![Estado del Proyecto](https://img.shields.io/badge/estado-producción-success)
![Versión](https://img.shields.io/badge/versión-2.0.0-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

## ✨ Características Principales

### 🔐 Gestión de Usuarios
- Registro y autenticación segura
- Gestión de sesiones con JWT
- Control de acceso basado en roles

### 💰 Control de Caja
- Apertura y cierre de caja con balance automático
- Registro detallado de ingresos y egresos
- Categorización de transacciones
- Multi-método de pago (efectivo, tarjeta, transferencia, mixto)
- Cálculo automático de diferencias

### 👤 Gestión de Barberos
- Tracking individual por barbero/profesional
- Desglose de ventas por barbero en cierres de caja
- Identificación del propietario
- Métricas de rendimiento por profesional

### 📊 Dashboard y Reportes
- Balance en tiempo real
- Historial completo de movimientos
- Reportes de cierre con breakdown por barbero
- Estadísticas de métodos de pago
- Resúmenes diarios, mensuales y anuales

## 🖼️ Screenshots
![alt text](<Screenshot 2025-11-07 144008.png>)
### Dashboard Principal
![alt text](<Screenshot 2025-11-07 144416.png>)
### Registro de Movimientos
 ![alt text](<Screenshot 2025-11-07 144436.png>)

 ### Reporte de Cierre
 ![alt text](<Screenshot 2025-11-07 144503.png>) 


## 🛠️ Stack Tecnológico

### Frontend
- ⚛️ **React 19** - Framework UI moderno
- 📘 **TypeScript** - Tipado estático
- 🎯 **Zustand** - Gestión de estado ligera
- 🎨 **TailwindCSS** - Sistema de diseño corporativo
- ⚡ **Vite** - Build tool ultrarrápido
- 🚦 **React Router 7** - Navegación

### Backend
- 🦕 **NestJS** - Framework empresarial Node.js
- 💾 **Prisma ORM** - ORM type-safe
- 🗄️ **PostgreSQL** - Base de datos relacional
- 🔑 **JWT** - Autenticación stateless
- 🔐 **bcrypt** - Hashing de contraseñas
- 🛡️ **Class Validator** - Validación de DTOs

## 🚀 Instalación y Uso

### Pre-requisitos
- Node.js >= 20.x
- PostgreSQL >= 14 (o MySQL >= 8.0)
- npm >= 9.0

### Configuración del Proyecto

1. **Clonar el repositorio**
```bash
git clone https://github.com/NahuelArg/cash-register-mvp.git
cd cash-register-mvp
```

2. **Configurar Backend**
```bash
cd server
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de BD
# Ejemplo: DATABASE_URL="postgresql://user:password@localhost:5432/cash_register"

# Ejecutar migraciones
npx prisma migrate deploy

# Crear datos iniciales (3 barberos)
npm run seed

# Iniciar servidor de desarrollo
npm run start:dev
```

3. **Configurar Frontend**
```bash
cd ../cash-register-client
npm install

# Configurar variables de entorno
echo "VITE_API_URL=http://localhost:3000" > .env

# Iniciar en modo desarrollo
npm run dev
```

4. **Acceder a la aplicación**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Docs (Swagger): http://localhost:3000/api

## 📚 Documentación API

La documentación interactiva de la API está disponible en `/api` cuando el servidor está corriendo:
- **Swagger UI**: http://localhost:3000/api
- **Endpoints principales**:
  - `POST /auth/register` - Registro de usuarios
  - `POST /auth/login` - Autenticación
  - `GET /cash-register/status` - Estado de caja
  - `POST /cash-register/open` - Abrir caja
  - `POST /cash-register/movement` - Registrar movimiento
  - `POST /cash-register/close` - Cerrar caja
  - `GET /cash-register/barbers` - Lista de barberos

## 🧪 Tests

```bash
# Backend tests
cd server
npm run test        # Unit tests
npm run test:cov    # Coverage

# Frontend tests
cd cash-register-client
npm run test
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

- **Nahuel** - [GitHub](https://github.com/NahuelArg)

## 🙏 Agradecimientos

- Gracias a todos los que han contribuido con feedback y sugerencias
- Inspirado en las necesidades reales de pequeños negocios

![CI/CD](https://github.com/NahuelArg/cash-register-mvp/actions/workflows/main.yml/badge.svg)
![Coverage](https://codecov.io/gh/NahuelArg/cash-register-mvp/branch/main/graph/badge.svg)
![Dependencies](https://status.david-dm.org/gh/NahuelArg/cash-register-mvp.svg)
![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=NahuelArg_cash-register-mvp&metric=alert_status)
![GitHub last commit](https://img.shields.io/github/last-commit/NahuelArg/cash-register-mvp)
![GitHub issues](https://img.shields.io/github/issues/NahuelArg/cash-register-mvp)
![GitHub pull requests](https://img.shields.io/github/issues-pr/NahuelArg/cash-register-mvp)
![NestJS Version](https://img.shields.io/github/package-json/dependency-version/NahuelArg/cash-register-mvp/@nestjs/core?filename=server%2Fpackage.json)
![React Version](https://img.shields.io/github/package-json/dependency-version/NahuelArg/cash-register-mvp/react?filename=cash-register-client%2Fpackage.json)