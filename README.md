# ☁️ TailorCV: Cloud-Native Portfolio Platform 2026

¡Bienvenido a **TailorCV**! Una solución integral para la gestión y optimización de currículums profesionales. Diseñada bajo una arquitectura **Serverless y Cloud-Native en AWS**, esta plataforma combina la potencia de la Inteligencia Artificial con una experiencia de usuario fluida y moderna.

---

## 🌐 Despliegue en Vivo

| Componente | URL de Acceso |
|:---|:---|
| **Página Pública (CDN)** | `https://your-domain.cloudfront.net` |
| **Backend API (Lambda)** | `https://your-api.execute-api.us-east-1.amazonaws.com` |

---

## 🛠️ Stack Tecnológico

*   **Frontend**: Angular 19+ (Signals, Standalone Components, Tailwind CSS).
*   **Backend**: Node.js & Express (Modular Architecture).
*   **Cloud Cloud**: AWS (S3, CloudFront, Lambda, API Gateway, DynamoDB).
*   **AI**: Google Gemini 2.5 Flash API.
*   **DevOps**: Docker, Docker Compose, Serverless Framework.

---

## ✨ Features Estrella

### 🤖 AI Tailor Assistant (Powered by Gemini)
Optimiza tu currículum para vacantes específicas. Nuestra IA analiza la descripción del puesto y adapta tu perfil profesional para maximizar tus posibilidades de éxito.

### 💎 Experiencia de Usuario Premium
*   **Midnight Mesh**: Estética visual moderna con gradientes dinámicos y "Glassmorphism".
*   **Modern Dialogs & Toasts**: Sistema de interacción personalizado que reemplaza las alertas nativas del navegador por componentes fluidos y animados.
*   **Skeleton Loading**: Transiciones de carga inteligentes que simulan la estructura del CV, mejorando la percepción de velocidad.

### 🔐 Gestión Robusta
*   **Dashboard Multi-CV**: Crea, duplica y gestiona múltiples versiones de tu portfolio.
*   **Seguridad**: Autenticación basada en JWT (JSON Web Tokens) y cifrado de contraseñas con bcryptjs.
*   **PDF Optimizado**: Estilos de impresión CSS avanzados para exportar currículums en formato A4 perfecto.

---

## 🚀 Guía de Desarrollo

### 📋 Prerrequisitos
- Node.js (v20 o superior)
- Docker Desktop (Recomendado para desarrollo)
- AWS CLI (Configurado con credenciales válidas si deseas desplegar)

### ⚙️ Configuración inicial
1. Copia el archivo de ejemplo de variables de entorno:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Abre `backend/.env` y añade tu `GEMINI_API_KEY` (puedes obtenerla en [Google AI Studio](https://aistudio.google.com/)) y define un `JWT_SECRET` para sesiones seguras.

### 🛠️ Ejecución Local Tradicional
Si tienes Node.js instalado, puedes levantar frontend y backend simultáneamente:
```bash
npm install
npm start
```

### 🐳 Ejecución con Docker (Recomendado)
Docker garantiza que el entorno sea idéntico al de producción sin necesidad de configurar nada en tu sistema local:
```bash
# Iniciar servicios con volumen de datos sincronizado (Hot Reload)
docker compose up --build

# Detener servicios
docker compose down
```

---

## 📦 Despliegue a AWS

### Backend (Lambda)
```bash
cd backend
npx serverless deploy
```

### Frontend (S3 + CloudFront)
```bash
cd frontend
npx ng build --configuration production
aws s3 sync dist/frontend/browser/ s3://your-s3-frontend-bucket --delete
# Invalidar caché si es necesario:
# aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## 📂 Estructura del repositorio

```text
├── backend
│   ├── src
│   │   ├── routes/      # Endpoints modulares (Auth, CV, AI)
│   │   ├── services/    # Clientes de AWS y Gemini
│   │   └── utils/       # Helpers y Middlewares
│   ├── Dockerfile       # Receta de contenedor backend
│   └── serverless.yml   # Definición de infraestructura AWS
├── frontend
│   ├── src/app
│   │   ├── components/  # UI (Editor, Dash, Toasts, Dialogs)
│   │   ├── services/    # Lógica de comunicación API
│   │   └── pipes/       # Transformadores de datos (Markdown)
│   └── Dockerfile       # Receta de contenedor frontend
└── docker-compose.yml   # Orquestación local de servicios
```

---
*Diseñado y Desarrollado por Jose Sebastian Barrios Cardozo*
