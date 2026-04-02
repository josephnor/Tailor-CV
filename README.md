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
*   **Backend**: Node.js & Express (Arquitectura Serverless).
*   **Nube**: AWS (S3, CloudFront, Lambda, API Gateway, DynamoDB).
*   **AI**: Google Gemini API (Model: `gemini-2.0-flash` o superior).
*   **DevOps**: Docker, Docker Compose, Serverless Framework.

---

## ✨ Features Estrella

### 🤖 AI Tailor Assistant (Powered by Gemini)
Optimiza tu currículum para vacantes específicas. Nuestra IA analiza la descripción del puesto (vía **texto directo o URL**) y adapta tu perfil profesional para maximizar tus posibilidades de éxito.

### 🧩 Gestión de Datos Inteligente
*   **Dynamic Contact Info**: Añade, edita y elimina campos de contacto personalizados (GitHub, Discord, Portfolio, etc.) de forma dinámica.
*   **Detailed Sections**: Gestión granular de Habilidades, Valores Éticos, Certificaciones e Idiomas (con niveles de maestría).
*   **Dashboard Multi-CV**: Crea, duplica y gestiona múltiples versiones de tu portfolio.

### 💎 Experiencia de Usuario Premium
*   **Midnight Mesh**: Estética visual moderna con gradientes dinámicos y "Glassmorphism".
*   **Modern Interaction**: Sistema de Toasts y Diálogos animados que garantizan una navegación fluida.
*   **Skeleton Loading**: Transiciones inteligentes que simulan la estructura del CV para una carga percibida instantánea.

### 🔐 Seguridad y Robustez
*   **Protección AI**: Mitigación de SSRF y Prompt Injection para interacciones seguras con la IA.
*   **Autenticación**: Gestión de sesiones basada en JWT y cifrado de contraseñas con bcryptjs.
*   **PDF Optimizado**: Estilos de impresión avanzados para exportar currículums en formato A4 perfecto.

---

## 🚀 Guía de Desarrollo

### 📋 Prerrequisitos
- Node.js (v20 o superior)
- Docker Desktop (Recomendado)
- AWS CLI (Configurado para despliegue)

### ⚙️ Configuración inicial
1. Copia el archivo de ejemplo de variables de entorno:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Abre `backend/.env` y añade tu `GEMINI_API_KEY` (obténla en [Google AI Studio](https://aistudio.google.com/)).

### 🛠️ Ejecución Local Tradicional
```bash
npm install
npm start
```

### 🐳 Ejecución con Docker (Recomendado)
```bash
# Iniciar servicios con Hot Reload
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
```

---

## 📂 Estructura del repositorio

```text
├── backend
│   ├── src
│   │   ├── routes/      # APIs (Auth, CV, AI Tailor)
│   │   ├── services/    # Clientes AWS (DynamoDB, S3)
│   │   └── middleware/  # Auth & Error Handling
│   ├── Dockerfile       # Receta de contenedor backend
│   └── serverless.yml   # IaC (Infrastructure as Code)
├── frontend
│   ├── src/app
│   │   ├── components/  # Admin, Dashboard, CV View
│   │   ├── services/    # Lógica de negocio & API
│   │   └── pipes/       # Transformadores de datos (Markdown)
│   └── Dockerfile       # Receta de contenedor frontend
└── docker-compose.yml   # Orquestación local de servicios
```

---
*Diseñado y Desarrollado por Jose Sebastian Barrios Cardozo*
