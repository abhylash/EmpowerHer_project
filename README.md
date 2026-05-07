# EmpowerHer - AI-Powered Women's Health & Wellness Platform

EmpowerHer is a comprehensive women's health platform that combines AI-powered insights, menstrual cycle tracking, nutrition monitoring, mental wellness support, pregnancy tracking, and government scheme recommendations.

## 🌟 Features

- **Cycle Tracking**: Monitor menstrual cycles with predictions and insights.
- **Nutrition & Fitness**: AI-powered food analysis and calorie tracking.
- **Mental Wellness**: Mood tracking with AI pattern analysis.
- **Pregnancy Support**: Week-by-week pregnancy tracking and symptom analysis.
- **Government Schemes**: Personalized scheme recommendations based on eligibility.
- **AI Health Assistant**: Chat-based health advice and support powered by multi-model OpenRouter fallback logic.
- **Health Reports**: Comprehensive monthly health reports with PDF generation.
- **Multi-language Support**: English, Hindi, Kannada, Tamil, Telugu.
- **PWA Ready**: Progressive Web App with offline capabilities and Service Worker support.

## 🛠 Tech Stack

### Backend
- **Framework**: Django 5.2
- **API**: Django REST Framework 3.15
- **Authentication**: SimpleJWT
- **Database**: PostgreSQL / SQLite (Development)
- **Cache / Message Broker**: Redis
- **Task Queue**: Celery 5
- **PDF Generation**: WeasyPrint 68.1+
- **AI**: OpenRouter.ai (OpenAI-compatible endpoints with dynamic model fallback)
- **SMS**: Twilio

### Frontend
- **Framework**: React 18.3
- **Build Tool**: Vite 5.3
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Internationalization**: react-i18next
- **PWA**: vite-plugin-pwa

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (or use default SQLite for dev)
- Redis Server
- OpenRouter.ai API key

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   cd empowerher/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   pip install --upgrade weasyprint # Important to prevent PDF generation errors
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   # Run migrations
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Seed government schemes**
   ```bash
   python manage.py seed_schemes
   ```

7. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start Django server**
   ```bash
   python manage.py runserver
   ```

9. **Start Celery worker** (in another terminal)
   ```bash
   # On Linux/Mac:
   celery -A empowerher worker -l info
   # On Windows:
   celery -A empowerher worker -l info --pool=solo
   ```

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd empowerher/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev -- --port 3001
   ```

## 📱 Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=empowerher
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379/0

# OpenRouter AI
OPENROUTER_API_KEY=your-openrouter-api-key

# Optional: Email and SMS
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-email-password
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_ENVIRONMENT=development
VITE_ENABLE_PWA=true
```

## 🏥 Architecture Highlights

- **Dynamic AI Model Fallback**: The backend dynamically routes AI requests through multiple free models (`poolside/laguna-xs.2:free`, etc.) on OpenRouter to prevent 429 rate-limiting issues natively.
- **Robust Authentication**: Axios interceptors intelligently clear local storage on `401 Unauthorized` responses to prevent infinite redirect loops.
- **Background Task Processing**: PDF Health Reports are offloaded to a Celery worker backed by Redis, ensuring the main application thread never freezes.
- **PWA Service Worker Handling**: Development mode disables aggressive caching to ensure Vite's HMR WebSockets work flawlessly.

## 🛠 Troubleshooting Common Issues

- **PDF Generation Crashes (TypeError: PDF.__init__)**: Upgrade Weasyprint (`pip install --upgrade weasyprint`) to fix `pydyf` incompatibilities.
- **Reports Taking Forever**: Check if the Celery worker terminal is running. Without it, tasks will stay pending in Redis forever.
- **Invalid Hook Call / WebSocket Errors in Frontend**: Do a hard refresh (`Ctrl + Shift + R`) to clear the Service Worker cache which might be loading stale chunks of React.
- **Infinite Login Loop**: Clear your `localStorage` and log in again. This happens if your JWT token exists but is invalid (e.g., if you migrated a fresh database).

## 🧪 Testing

### Backend Tests
```bash
python manage.py test
```

### Frontend Tests
```bash
npm run test
```

## 📄 License

This project is licensed under the MIT License.

---

**EmpowerHer - Your Health. Your Story.** 🌸
