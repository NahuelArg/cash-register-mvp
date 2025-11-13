# 🚀 Guía de Despliegue - Cash Register MVP

Esta guía te ayudará a desplegar el backend en Railway y el frontend en Vercel.

## 📋 Pre-requisitos

- Cuenta en [Railway](https://railway.app)
- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [GitHub](https://github.com) (tu código debe estar en un repositorio)

---

## 🔧 PARTE 1: Desplegar Backend en Railway

### 1.1 Crear Nuevo Proyecto en Railway

1. Ve a [railway.app](https://railway.app) e inicia sesión
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway para acceder a tu repositorio
5. Selecciona tu repositorio `cash-register-mvp`

### 1.2 Configurar el Servicio del Backend

1. Railway detectará automáticamente el proyecto
2. **IMPORTANTE**: Configura el **Root Directory** a `server`
   - En la configuración del servicio → Settings → Root Directory → escribe `server`

### 1.3 Agregar Base de Datos MySQL

1. En tu proyecto de Railway, click en **"New"** → **"Database"** → **"Add MySQL"**
2. Railway creará automáticamente la base de datos y la variable `DATABASE_URL`
3. La variable `DATABASE_URL` se conectará automáticamente a tu servicio

### 1.4 Configurar Variables de Entorno

En Railway, ve a tu servicio backend → **Variables** → **Add Variables**

Agrega las siguientes variables:

```bash
# Base de datos (Railway la provee automáticamente al agregar MySQL)
DATABASE_URL=${{MySQL.DATABASE_URL}}

# JWT Configuration
JWT_SECRET=tu-secreto-super-seguro-aqui-cambialo
JWT_EXPIRATION_TIME=7d

# CORS - IMPORTANTE: Agregarás esto DESPUÉS de desplegar en Vercel
ALLOWED_ORIGINS=https://tu-app.vercel.app

# Node Environment
NODE_ENV=production
```

**⚠️ IMPORTANTE**:
- Genera un JWT_SECRET seguro. Puedes usar: `openssl rand -base64 32`
- La variable `ALLOWED_ORIGINS` debe tener el dominio de Vercel (lo agregarás después)

### 1.5 Verificar Configuración de Build

Railway debería detectar automáticamente los scripts del `railway.json`:

- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npx prisma migrate deploy && node dist/main.js`

Si no se detecta automáticamente:
1. Ve a Settings → Build
2. Configura manualmente los comandos

### 1.6 Crear y Aplicar Migraciones de Prisma

Antes del primer despliegue, necesitas crear las migraciones:

```bash
# En tu computadora local, dentro de la carpeta server/
cd server
npx prisma migrate dev --name init
```

Esto creará la carpeta `server/prisma/migrations`. Haz commit y push:

```bash
git add prisma/migrations
git commit -m "feat: add initial database migrations"
git push
```

### 1.7 Desplegar

1. Click en **"Deploy"** (o simplemente haz push al repo, Railway auto-despliega)
2. Espera a que termine el build (verás los logs en tiempo real)
3. Una vez completado, copia la URL generada:
   - Ve a **Settings** → **Networking** → **Public Networking** → Copia el dominio (ej: `https://cash-register-backend.up.railway.app`)

### 1.8 Verificar Deployment

Abre tu navegador y visita:
```
https://tu-backend-url.railway.app/api
```

Deberías ver la documentación de Swagger.

---

## 🌐 PARTE 2: Desplegar Frontend en Vercel

### 2.1 Crear Nuevo Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en **"Add New..."** → **"Project"**
3. Importa tu repositorio de GitHub
4. Selecciona `cash-register-mvp`

### 2.2 Configurar el Proyecto

En la configuración del proyecto:

**Framework Preset**: Vite

**Root Directory**: Click en "Edit" y escribe `cash-register-client`

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 2.3 Configurar Variables de Entorno

En la sección **Environment Variables**, agrega:

```bash
VITE_API_URL=https://tu-backend-url.railway.app
```

**⚠️ IMPORTANTE**:
- Usa la URL de Railway que copiaste en el paso 1.7
- NO incluyas la barra final `/`
- Ejemplo: `https://cash-register-backend.up.railway.app`

### 2.4 Desplegar

1. Click en **"Deploy"**
2. Espera a que termine el build (1-3 minutos)
3. Una vez completado, Vercel te mostrará la URL del frontend
4. Copia esta URL (ej: `https://cash-register-mvp.vercel.app`)

---

## 🔄 PARTE 3: Actualizar CORS en Railway

¡IMPORTANTE! Ahora que tienes la URL de Vercel, debes agregarla a Railway:

1. Vuelve a [Railway](https://railway.app)
2. Ve a tu servicio backend → **Variables**
3. Edita la variable `ALLOWED_ORIGINS` y agrega la URL de Vercel:

```bash
ALLOWED_ORIGINS=https://tu-app.vercel.app
```

4. Railway automáticamente reiniciará el servicio

---

## ✅ PARTE 4: Verificar que Todo Funciona

### 4.1 Probar el Backend

Visita: `https://tu-backend.railway.app/api`
- ✅ Deberías ver Swagger UI

### 4.2 Probar el Frontend

Visita: `https://tu-app.vercel.app`
- ✅ La aplicación debería cargar
- ✅ Deberías poder registrarte/iniciar sesión
- ✅ Las peticiones al backend deberían funcionar

---

## 🐛 Troubleshooting

### Problema: Error 500 en Railway

**Causa**: Probablemente las migraciones no se aplicaron

**Solución**:
1. Ve a Railway → tu servicio → Logs
2. Busca errores relacionados con Prisma
3. Asegúrate de haber creado y pusheado las migraciones:
```bash
cd server
npx prisma migrate dev --name init
git add prisma/migrations
git commit -m "feat: add migrations"
git push
```

### Problema: CORS Error en el Frontend

**Causa**: La URL de Vercel no está en `ALLOWED_ORIGINS`

**Solución**:
1. Ve a Railway → Variables
2. Verifica que `ALLOWED_ORIGINS` tenga la URL exacta de Vercel
3. Asegúrate de usar `https://` (no `http://`)

### Problema: Frontend no se conecta al Backend

**Causa**: `VITE_API_URL` está mal configurada

**Solución**:
1. Ve a Vercel → tu proyecto → Settings → Environment Variables
2. Verifica que `VITE_API_URL` tenga la URL correcta de Railway
3. Re-deploya el frontend (Settings → Deployments → menú de 3 puntos → Redeploy)

### Problema: Build falla en Railway

**Causa**: Falta alguna dependencia o variable

**Solución**:
1. Revisa los logs de Railway
2. Asegúrate de que `railway.json` existe en `/server/railway.json`
3. Verifica que todas las variables de entorno estén configuradas

---

## 📝 Resumen de URLs y Variables

### Railway (Backend)

**Variables de Entorno Necesarias**:
```
DATABASE_URL=${{MySQL.DATABASE_URL}}
JWT_SECRET=[genera-uno-seguro]
JWT_EXPIRATION_TIME=7d
ALLOWED_ORIGINS=https://tu-frontend.vercel.app
NODE_ENV=production
```

**URL del Backend**: `https://tu-app.up.railway.app`

### Vercel (Frontend)

**Variables de Entorno Necesarias**:
```
VITE_API_URL=https://tu-backend.railway.app
```

**URL del Frontend**: `https://tu-app.vercel.app`

---

## 🔄 Actualizaciones Futuras

### Actualizar el Backend
```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push
# Railway automáticamente hace re-deploy
```

### Actualizar el Frontend
```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push
# Vercel automáticamente hace re-deploy
```

Ambas plataformas tienen **continuous deployment** activado por defecto.

---

## 🎉 ¡Listo!

Tu aplicación ahora está desplegada en producción:
- 🔥 Backend en Railway con MySQL
- ⚡ Frontend en Vercel con Vite
- 🔒 CORS configurado correctamente
- 🗄️ Base de datos con migraciones automáticas

Si tienes problemas, revisa los logs en:
- **Railway**: Tu proyecto → servicio → Logs
- **Vercel**: Tu proyecto → Deployments → click en el deployment → View Function Logs
