# Cash Register MVP 💰

Sistema de gestión de caja diseñado específicamente para barberías y pequeños negocios, con enfoque en simplicidad y eficiencia.

![Estado del Proyecto](https://img.shields.io/badge/estado-completado-success)
![Versión](https://img.shields.io/badge/versión-1.0.0-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

## ✨ Características Principales

🔐 **Gestión de Usuarios**
- Registro y autenticación segura
- Roles y permisos
- Gestión de sesiones con JWT

💰 **Control de Caja**
- Apertura y cierre de caja con balance
- Registro detallado de movimientos
- Categorización de transacciones
- Multi-método de pago (efectivo, tarjeta, transferencia)

📊 **Dashboard y Reportes**
- Balance en tiempo real
- Historial de movimientos
- Reportes de cierre detallados
- Diferencias de caja automatizadas

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
- ⚛️ **React 18** - Framework UI
- 📘 **TypeScript** - Tipado estático
- 🎯 **Zustand** - Gestión de estado
- 🎨 **TailwindCSS** - Estilos
- ⚡ **Vite** - Build tool

### Backend
- 🦕 **NestJS** - Framework Backend
- 💾 **Prisma ORM** - Base de datos
- 🗄️ **MySQL** - Base de datos
- 🔑 **JWT** - Autenticación
- 📚 **Swagger** - Documentación API

## 🚀 Instalación y Uso

### Pre-requisitos
- Node.js >= 18
- MySQL >= 8.0
- npm o yarn

### Configuración del Proyecto

1. **Clonar el repositorio**
\`\`\`bash
git clone https://github.com/NahuelArg/cash-register-mvp.git
cd cash-register-mvp
\`\`\`

2. **Configurar Backend**
\`\`\`bash
cd server
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de BD

# Iniciar servidor de desarrollo
npm run start:dev
\`\`\`

3. **Configurar Frontend**
\`\`\`bash
cd ../cash-register-client
npm install
npm run dev
\`\`\`

## 📚 Documentación

- [Documentación Frontend](./cash-register-client/README.md)
- [Documentación Backend](./server/README.md)
- [API Docs](http://localhost:3000/api) (Swagger UI disponible al iniciar el servidor)

## 🧪 Tests

\`\`\`bash
# Backend tests
cd server
npm run test        # Unit tests
npm run test:e2e    # E2E tests

# Frontend tests
cd cash-register-client
npm run test
\`\`\`

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