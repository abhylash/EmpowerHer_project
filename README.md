# EmpowerHer - AI-Powered Women's Health & Wellness Platform

EmpowerHer is a comprehensive women's health platform that combines AI-powered insights, menstrual cycle tracking, nutrition monitoring, mental wellness support, pregnancy tracking, and government scheme recommendations.

## 🌟 Features

- **Cycle Tracking**: Monitor menstrual cycles with predictions and insights
- **Nutrition & Fitness**: AI-powered food analysis and calorie tracking
- **Mental Wellness**: Mood tracking with AI pattern analysis
- **Pregnancy Support**: Week-by-week pregnancy tracking and symptom analysis
- **Government Schemes**: Personalized scheme recommendations based on eligibility
- **AI Health Assistant**: Chat-based health advice and support
- **Health Reports**: Comprehensive monthly health reports with PDF generation
- **Multi-language Support**: English, Hindi, Kannada, Tamil, Telugu
- **PWA Ready**: Progressive Web App with offline capabilities

## 🛠 Tech Stack

### Backend
- **Framework**: Django 5.2
- **API**: Django REST Framework 3.15
- **Authentication**: SimpleJWT
- **Database**: PostgreSQL
- **Cache**: Redis
- **Task Queue**: Celery 5
- **PDF Generation**: WeasyPrint
- **AI**: OpenRouter.ai (OpenAI-compatible)
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
- Python 3.12+
- Node.js 18+
- PostgreSQL
- Redis
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
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   # Create PostgreSQL database
   createdb empowerher
   
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
   celery -A empowerher worker -l info
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
   npm run dev
   ```

## 📱 Access the Application

- **Frontend**: http://localhost:5173
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

## 🧪 Testing

### Backend Tests
```bash
python manage.py test
```

### Frontend Tests
```bash
npm run test
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/token/refresh/` - Token refresh
- `GET /api/auth/profile/` - Get user profile
- `PATCH /api/auth/profile/update/` - Update profile
- `GET /api/auth/dashboard/` - Dashboard data

### Cycle Tracking
- `GET /api/cycles/` - List cycles
- `POST /api/cycles/` - Create cycle
- `PATCH /api/cycles/<id>/` - Update cycle
- `GET /api/cycles/prediction/` - Get predictions

### Fitness & Nutrition
- `GET /api/fitness/meals/` - List meals
- `POST /api/fitness/meals/` - Create meal
- `POST /api/fitness/meals/analyse-photo/` - Analyze food photo
- `GET /api/fitness/summary/` - Nutrition summary

### Mental Wellness
- `GET /api/mental/mood/` - List moods
- `POST /api/mental/mood/` - Create mood
- `GET /api/mental/patterns/` - Mood patterns analysis

### Pregnancy
- `GET /api/pregnancy/` - Get pregnancy profile
- `POST /api/pregnancy/` - Create pregnancy profile
- `GET /api/pregnancy/weekly/` - Weekly development data
- `POST /api/pregnancy/symptoms/` - Analyze symptoms

### Government Schemes
- `GET /api/schemes/eligible/` - Eligible schemes
- `GET /api/schemes/all/` - All schemes

### Reports
- `GET /api/reports/` - List reports
- `POST /api/reports/generate/` - Generate report
- `GET /api/reports/<id>/download/` - Download report

### AI Chat
- `POST /api/ai/chat/` - AI chat (streaming)

## 🌍 Internationalization

The app supports 5 languages:
- English (en)
- Hindi (hi)
- Kannada (kn)
- Tamil (ta)
- Telugu (te)

Translation files are located in `frontend/public/locales/[lang]/translation.json`

## 📱 PWA Features

- Offline support for basic functionality
- Installable as native app
- Push notifications support
- Responsive design for all devices

## 🔒 Security Features

- JWT-based authentication
- Password hashing
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection

## 🚀 Deployment

### Production Deployment

1. **Backend Deployment**
   - Set `DEBUG=False` in production
   - Configure production database
   - Set up Redis cluster
   - Configure Celery with proper broker
   - Set up SSL certificates
   - Configure domain and CORS settings

2. **Frontend Deployment**
   - Build for production: `npm run build`
   - Deploy to static hosting
   - Configure PWA manifest
   - Set up service worker

### Docker Support

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@empowerher.com
- GitHub Issues: [Create an issue](https://github.com/empowerher/empowerher/issues)
- Documentation: [Wiki](https://github.com/empowerher/empowerher/wiki)

## 🌟 Acknowledgments

- OpenRouter.ai for AI services
- Django and DRF communities
- React and Vite teams
- Tailwind CSS
- All contributors and users

---

**EmpowerHer - Your Health. Your Story.** 🌸
