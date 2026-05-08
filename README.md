# 🌸 EmpowerHer — AI-Powered Women's Health & Wellness Platform

EmpowerHer is a full-stack web application designed to help women track their health, get AI-powered insights, discover government welfare schemes, and generate comprehensive health reports — all in one place.

> Built with **Django** (Backend) + **React + Vite** (Frontend) + **Redis + Celery** (Background Tasks) + **OpenRouter AI** (AI Chat)

---

## 🌟 Features

- 🩺 **Menstrual Cycle Tracker** — Log periods, get next period & ovulation predictions
- 🥗 **Fitness & Nutrition Logger** — Track daily meals and macros (calories, protein, carbs, fat)
- 🧠 **Mental Wellness Journal** — Log moods daily, view 14-day trend chart, get AI pattern analysis
- 🤰 **Pregnancy Tracker** — Week-by-week baby development, symptom danger checker
- 🏛️ **Government Schemes** — Discover schemes you're eligible for based on your profile
- 💬 **AI Health Assistant** — Chat with an AI trained on Indian women's health context
- 📄 **Health Report Generator** — Download a full PDF health report
- 🌐 **Multi-Language** — English, Hindi, Kannada, Tamil, Telugu
- 📱 **PWA Ready** — Install as a native app on your phone

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 + Tailwind CSS |
| Backend | Django 5 + Django REST Framework |
| Authentication | JWT (SimpleJWT) |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Background Tasks | Celery 5 + Redis |
| PDF Generation | WeasyPrint |
| AI | OpenRouter.ai (multi-model fallback) |
| State Management | Zustand |
| Charts | Recharts |

---

## 📋 Prerequisites — Install These First

Before cloning, make sure the following are installed on your machine:

### 1. Python 3.10 or higher
- Download from: https://www.python.org/downloads/
- ✅ During installation, **check "Add Python to PATH"**
- Verify: `python --version`

### 2. Node.js 18 or higher
- Download from: https://nodejs.org/
- Verify: `node --version` and `npm --version`

### 3. Git
- Download from: https://git-scm.com/downloads
- Verify: `git --version`

### 4. Redis Server
Redis is required for background report generation (Celery).

**On Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt install redis-server
sudo service redis-server start

# Mac (with Homebrew)
brew install redis
brew services start redis
```

**On Windows:**
- Option A (Recommended): Install [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) then run `sudo apt install redis-server && sudo service redis-server start`
- Option B: Install [Memurai](https://www.memurai.com/) (Windows Redis alternative)

**Verify Redis is running:**
```bash
redis-cli ping
# Should print: PONG
```

### 5. GTK3 (Windows only — for PDF reports)
WeasyPrint requires GTK3 on Windows. Follow the [official WeasyPrint Windows guide](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#windows) to install the GTK3 runtime and add its `/bin` folder to your PATH.

---

## 🚀 Installation — Step by Step

### Step 1: Clone the Repository

```bash
git clone https://github.com/abhylash/EmpowerHer_project.git
cd EmpowerHer_project
```

---

### Step 2: Backend Setup (Django)

Open a terminal and navigate to the `backend` folder:

```bash
cd backend
```

#### 2.1 — Create a Python Virtual Environment

```bash
python -m venv venv
```

#### 2.2 — Activate the Virtual Environment

**On Linux/Mac:**
```bash
source venv/bin/activate
```

**On Windows (Command Prompt):**
```bash
venv\Scripts\activate
```

**On Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

> ✅ You'll see `(venv)` appear at the start of your terminal prompt.

#### 2.3 — Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### 2.4 — Upgrade WeasyPrint (Important!)
This step is required to avoid a PDF generation crash:

```bash
pip install --upgrade weasyprint
```

#### 2.5 — Create the Environment Variables File

Create a file named `.env` inside the `backend` folder:

```bash
# On Linux/Mac:
touch .env

# On Windows (Command Prompt):
type nul > .env
```

Now open the `.env` file in any text editor and paste the following:

```env
DEBUG=True
SECRET_KEY=empowerher-super-secret-key-change-this-in-production
REDIS_URL=redis://localhost:6379/0
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

> 🔑 **Getting an OpenRouter API Key:**
> 1. Go to https://openrouter.ai/
> 2. Sign up for a free account
> 3. Go to https://openrouter.ai/settings/keys
> 4. Click "Create Key" and copy it
> 5. Paste it as the value of `OPENROUTER_API_KEY` in your `.env` file

#### 2.6 — Run Database Migrations

```bash
python manage.py migrate
```

Expected output: a list of migrations being applied ✅

#### 2.7 — Seed Government Schemes Data

```bash
python manage.py seed_schemes
```

This loads all the government welfare schemes into the database.

#### 2.8 — (Optional) Create an Admin Account

```bash
python manage.py createsuperuser
```

Follow the prompts to create a username and password. You can then access the admin panel at `http://127.0.0.1:8000/admin`

#### 2.9 — Start the Django Backend Server

```bash
python manage.py runserver
```

> ✅ You should see:
> ```
> Starting development server at http://127.0.0.1:8000/
> ```
> **Keep this terminal open.**

---

### Step 3: Start the Background Worker (For PDF Reports)

> ⚠️ **This step is required for Health Report generation to work.** Without it, reports will be stuck on "pending" forever.

Open a **NEW terminal window**, navigate to `backend`, activate venv again, and run:

**On Linux/Mac:**
```bash
cd EmpowerHer_project/backend
source venv/bin/activate
celery -A empowerher worker -l info
```

**On Windows:**
```bash
cd EmpowerHer_project\backend
venv\Scripts\activate
celery -A empowerher worker -l info --pool=solo
```

> ✅ You should see:
> ```
> celery@your-machine ready.
> ```
> **Keep this terminal open.**

---

### Step 4: Frontend Setup (React)

Open a **THIRD terminal window** and navigate to the `frontend` folder:

```bash
cd EmpowerHer_project/frontend
```

#### 4.1 — Install Node Dependencies

```bash
npm install
```

This may take 1–2 minutes on the first run.

#### 4.2 — Start the React Development Server

```bash
npm run dev -- --port 3001
```

> ✅ You should see:
> ```
> VITE v5.x.x  ready in Xs
> ➜  Local:   http://localhost:3001/
> ```

---

## 🌐 Open the App

Once all three services are running, open your browser and go to:

**👉 http://localhost:3001**

You should see the EmpowerHer landing page!

---

## 📋 Summary — Terminals to Keep Open

| Terminal | Command | Purpose |
|----------|---------|---------|
| Terminal 1 | `python manage.py runserver` | Django backend API |
| Terminal 2 | `celery -A empowerher worker -l info` | PDF report generation |
| Terminal 3 | `npm run dev -- --port 3001` | React frontend UI |

---

## 🔑 How to Register & Use the App

1. Open `http://localhost:3001`
2. Click **"Get Started"** or **"Register"**
3. Fill in your name, email, username, and password
4. After registering, you'll be taken to an **Onboarding** form — fill in your age, state, health conditions etc. This helps personalise your experience
5. You'll be redirected to your **Dashboard** — all features are now accessible!

---

## 📁 Project Structure

```
EmpowerHer_project/
├── backend/                   ← Django backend
│   ├── apps/
│   │   ├── auth_app/          ← User registration, login, profile
│   │   ├── cycles/            ← Menstrual cycle tracking
│   │   ├── fitness/           ← Food logging, nutrition summary
│   │   ├── mental/            ← Mood journaling, AI pattern analysis
│   │   ├── pregnancy/         ← Pregnancy tracking, symptom checker
│   │   ├── schemes/           ← Government schemes database
│   │   ├── reports/           ← PDF health report generation
│   │   └── ai_service/        ← OpenRouter AI chat integration
│   ├── empowerher/            ← Django project settings & URLs
│   ├── templates/reports/     ← HTML template for PDF reports
│   ├── requirements.txt       ← Python dependencies
│   └── .env                   ← Your secret config (not in git)
│
└── frontend/                  ← React frontend
    ├── src/
    │   ├── pages/             ← All page components
    │   ├── components/        ← Shared components (Navbar, Footer)
    │   ├── api/axios.js       ← API client with auth interceptors
    │   ├── store/             ← Zustand state management
    │   └── i18n.js            ← Multi-language setup
    ├── public/locales/        ← Translation files (en, hi, kn, ta, te)
    └── vite.config.js         ← Vite config (proxies /api to backend)
```

---

## 🔧 Environment Variables Reference

Create `backend/.env` with these variables:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DEBUG` | Yes | Django debug mode | `True` |
| `SECRET_KEY` | Yes | Django secret key (any long random string) | `my-super-secret-key-123` |
| `REDIS_URL` | Yes | Redis connection URL | `redis://localhost:6379/0` |
| `OPENROUTER_API_KEY` | Yes | API key from openrouter.ai | `sk-or-v1-...` |

---

## ❓ Troubleshooting

### ❌ "No module named 'decouple'" or similar import error
Make sure you activated the virtual environment first:
```bash
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

### ❌ Reports stuck on "Generating..." forever
The Celery worker is not running. Open a new terminal and run:
```bash
# Linux/Mac:
celery -A empowerher worker -l info

# Windows:
celery -A empowerher worker -l info --pool=solo
```

### ❌ PDF generation crashes with `TypeError: PDF.__init__() takes 1 positional argument`
Run this to fix the WeasyPrint version:
```bash
pip install --upgrade weasyprint
```
Then restart the Celery worker.

### ❌ "No endpoints found" or "429 Rate Limit" from AI chat
OpenRouter free models can get rate-limited. Wait 30–60 seconds and try again. The app uses a 3-model fallback chain to handle this automatically.

### ❌ React shows blank white screen
Clear the browser cache with a hard refresh:
- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

### ❌ "redis-cli ping" shows "Connection refused"
Redis is not running. Start it:
```bash
# Ubuntu/Debian:
sudo service redis-server start

# Mac:
brew services start redis
```

### ❌ Port 3001 already in use
Kill the existing process and restart:
```bash
# Find and kill process on port 3001
npx kill-port 3001
npm run dev -- --port 3001
```

---

## 📱 App Routes

| URL | Page |
|-----|------|
| `/` | Landing page |
| `/register` | Create account |
| `/login` | Sign in |
| `/dashboard` | Health overview |
| `/cycles` | Cycle tracker |
| `/fitness` | Food & nutrition logger |
| `/mental` | Mood journal |
| `/pregnancy` | Pregnancy tracker |
| `/schemes` | Government schemes |
| `/reports` | Health report generator |
| `/ai-chat` | AI Health Assistant |
| `/onboarding` | Profile setup |

---

## 🤝 Need Help?

- Open an issue at: https://github.com/abhylash/EmpowerHer_project/issues
- Check `WINDOWS_SETUP.md` for detailed Windows-specific instructions
- Check `FEATURES.md` for a full explanation of every feature with real-life examples

---

**EmpowerHer — Your Health. Your Story.** 🌸
