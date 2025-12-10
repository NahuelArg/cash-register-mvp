# 🚀 Guía de Deploy Gratuito

Deploy completo del sistema de caja registradora **SIN COSTO**.

## 📊 Parte 1: Base de Datos en Supabase (Gratis)

### 1. Crear cuenta en Supabase
1. Ve a https://supabase.com
2. Click en "Start your project"
3. Crea cuenta con GitHub (recomendado) o email
4. ✅ **No requiere tarjeta de crédito**

### 2. Crear proyecto
1. Click en "New Project"
2. Completa:
   - **Name**: `cash-register-db`
   - **Database Password**: Genera una contraseña segura (guárdala)
   - **Region**: Selecciona la más cercana (Europe West - Frankfurt)
   - **Pricing Plan**: Free (ya seleccionado)
3. Click en "Create new project"
4. Espera 2-3 minutos mientras se crea

### 3. Obtener DATABASE_URL
1. En tu proyecto, ve a **Settings** (⚙️)
2. Click en **Database** en el menú lateral
3. Busca la sección **Connection string**
4. Selecciona el modo: **Session mode** (recomendado para Prisma)
5. Copia el URL completo (se verá así):
   ```
   postgresql://postgres.[REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```
6. Reemplaza `[PASSWORD]` con tu contraseña real
7. **Guarda este URL** - lo necesitarás para Render

---

## 🚀 Parte 2: Backend en Render (Gratis)

### 1. Preparar repositorio
Tu código ya está listo. Solo asegúrate de que todos los cambios estén pusheados:

```bash
git add -A
git commit -m "chore: prepare for deployment"
git push origin claude/cash-system-changes-01USsbtEoe5gfgqGXU7bVLjT
```

### 2. Crear cuenta en Render
1. Ve a https://render.com
2. Click en "Get Started"
3. Regístrate con GitHub (recomendado)
4. Autoriza a Render a acceder a tus repositorios
5. ✅ **No requiere tarjeta de crédito**

### 3. Crear Web Service
1. En el Dashboard, click en **"New +"** → **"Web Service"**
2. Conecta tu repositorio `cash-register-mvp`
3. Configuración:
   - **Name**: `cash-register-api`
   - **Region**: Frankfurt (EU Central)
   - **Branch**: `claude/cash-system-changes-01USsbtEoe5gfgqGXU7bVLjT`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**:
     ```bash
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command**:
     ```bash
     npx prisma migrate deploy && npm run start:prod
     ```
   - **Instance Type**: **Free**

### 4. Configurar Variables de Entorno
En la página del servicio, ve a **"Environment"** y agrega:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | (Pega el URL de Supabase) |
| `JWT_SECRET` | (Genera uno: https://randomkeygen.com/) |
| `JWT_EXPIRATION_TIME` | `7d` |
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGINS` | `https://cash-register-mvp.vercel.app` |

### 5. Deploy
1. Click en **"Create Web Service"**
2. Render automáticamente:
   - Clona tu repositorio
   - Instala dependencias
   - Ejecuta las migraciones
   - Inicia el servidor
3. Espera 3-5 minutos
4. Tu API estará en: `https://cash-register-api.onrender.com`

---

## 🌐 Parte 3: Frontend en Vercel (Gratis)

### 1. Crear cuenta en Vercel
1. Ve a https://vercel.com
2. Click en "Sign Up"
3. Regístrate con GitHub
4. ✅ **No requiere tarjeta de crédito**

### 2. Deploy frontend
1. En el Dashboard, click en **"Add New..."** → **"Project"**
2. Importa tu repositorio `cash-register-mvp`
3. Configuración:
   - **Framework Preset**: Vite
   - **Root Directory**: `cash-register-client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Variables de Entorno
En "Environment Variables", agrega:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://cash-register-api.onrender.com` |

### 4. Deploy
1. Click en **"Deploy"**
2. Espera 2-3 minutos
3. Tu aplicación estará en: `https://cash-register-mvp.vercel.app`

### 5. Actualizar CORS en Backend
1. Ve a tu servicio en Render
2. En "Environment", actualiza `ALLOWED_ORIGINS`:
   ```
   https://cash-register-mvp.vercel.app
   ```
3. Guarda y Render redesplegará automáticamente

---

## ✅ Verificación Final

1. **Base de datos**: Ve a Supabase → Table Editor → Deberías ver tus tablas
2. **Backend**: Abre `https://cash-register-api.onrender.com` → Debería responder
3. **Frontend**: Abre `https://cash-register-mvp.vercel.app` → Debería cargar el login

---

## 📊 Límites del Tier Gratuito

### Supabase (Base de Datos)
- ✅ 500 MB de base de datos
- ✅ 2 GB de almacenamiento
- ✅ Sin límite de tiempo
- ⚠️ Proyecto pausado después de 7 días de inactividad (se reactiva automáticamente)

### Render (Backend)
- ✅ 750 horas/mes (suficiente para 24/7)
- ✅ 512 MB RAM
- ⚠️ El servicio se "duerme" después de 15 minutos de inactividad
- ⚠️ Primera petición después de dormir toma ~30 segundos

### Vercel (Frontend)
- ✅ 100 GB de bandwidth/mes
- ✅ Despliegues ilimitados
- ✅ Sin límite de tiempo

---

## 🔧 Solución de Problemas

### Backend no inicia
1. Revisa los logs en Render
2. Verifica que `DATABASE_URL` sea correcto
3. Asegúrate de que el formato sea: `postgresql://...`

### Frontend no conecta con Backend
1. Verifica `VITE_API_URL` en Vercel
2. Verifica `ALLOWED_ORIGINS` en Render
3. Ambos deben coincidir exactamente (sin `/` al final)

### Base de datos vacía
1. Ve a Render → Logs
2. Busca "Running migrations"
3. Si no aparece, redeploy manualmente

---

## 🎉 ¡Listo!

Ahora tienes tu sistema de caja registradora desplegado **completamente GRATIS**:
- ✅ Base de datos PostgreSQL en Supabase
- ✅ Backend NestJS en Render
- ✅ Frontend React en Vercel

**Costo total: €0/mes** 💰
