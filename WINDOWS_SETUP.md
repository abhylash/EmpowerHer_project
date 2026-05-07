# EmpowerHer - Windows Setup Guide

This guide provides step-by-step instructions for setting up and running the EmpowerHer project on a Windows machine.

## Prerequisites

Before you begin, ensure you have the following installed on your laptop:
1. **Python 3.10+**: [Download Python](https://www.python.org/downloads/windows/) (Ensure you check "Add Python to PATH" during installation).
2. **Node.js (v18+)**: [Download Node.js](https://nodejs.org/).
3. **Redis Server**: Since native Redis doesn't officially support Windows, you have two options:
   - **Option A (Recommended):** Use WSL2 (Windows Subsystem for Linux) and install Redis via `sudo apt install redis-server` and run `sudo service redis-server start`.
   - **Option B:** Install [Memurai](https://www.memurai.com/) (a Windows-native Redis alternative).
4. **GTK3 (For PDF Generation)**: The `weasyprint` library requires GTK3 on Windows to generate PDF reports. Follow the official [WeasyPrint Windows Installation Guide](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#windows) to install the GTK3 runtime and add it to your System PATH.

---

## 1. Backend Setup (Django + Celery)

Open a new Command Prompt or PowerShell and navigate to the project root directory.

### Step 1.1: Create and Activate Virtual Environment
```bash
cd backend
python -m venv venv
# Activate the virtual environment
venv\Scripts\activate
```

### Step 1.2: Install Python Dependencies
```bash
pip install -r requirements.txt
# VERY IMPORTANT: Upgrade weasyprint to avoid pydyf compatibility errors during PDF generation!
pip install --upgrade weasyprint
```

### Step 1.3: Set Up Environment Variables
Create a file named `.env` in the `backend` folder and add the following:
```ini
# backend/.env
DEBUG=True
SECRET_KEY=your-django-secret-key-here
REDIS_URL=redis://localhost:6379/0
OPENROUTER_API_KEY=your-openrouter-api-key-here
```
*(Ask your team for the active OpenRouter API Key if you don't have your own).*

### Step 1.4: Run Database Migrations
```bash
python manage.py migrate
```

### Step 1.5: Seed Data
```bash
python manage.py seed_schemes
```

### Step 1.6: Start the Django Server
```bash
python manage.py runserver
```
The backend API will now be running at `http://127.0.0.1:8000/`.

---

## 2. Background Worker Setup (For Report Generation)

To generate PDF Health Reports, you must run the Celery worker process.
Open a **second** Command Prompt/PowerShell terminal.

```bash
cd backend
venv\Scripts\activate
# IMPORTANT: On Windows, Celery requires the "--pool=solo" flag to work correctly!
celery -A empowerher worker -l info --pool=solo
```

---

## 3. Frontend Setup (React + Vite)

Open a **third** Command Prompt/PowerShell terminal.

```bash
cd frontend

# Install Node modules
npm install

# Start the Vite development server
npm run dev -- --port 3001
```
The frontend will start running at `http://localhost:3001/`. Open the link provided in the terminal to view the EmpowerHer application!

---

## 4. Troubleshooting

- **PDF Generation Fails/Crashes (`TypeError: PDF.__init__() takes 1 positional argument but 3 were given`):** 
  This happens if `weasyprint` and `pydyf` versions mismatch. Run `pip install --upgrade weasyprint` in your virtual environment and restart your celery worker.
- **Reports Take Forever to Generate:**
  Ensure you have your second terminal running the `celery` command! If celery is not running, the reports are just queued in Redis and waiting endlessly.
- **Infinite Login Loop / 401 Unauthorized:**
  If you reset your database, your old JWT tokens will become invalid. If you encounter an infinite loop, clear your `localStorage` in the browser or perform a hard refresh.
- **React Invalid Hook Call / WebSocket Errors:**
  If Vite fails to connect to HMR WebSockets or you get React chunk errors, the Service Worker is likely caching old chunks. Perform a Hard Refresh (`Ctrl + Shift + R`) to clear out the aggressive Service Worker cache.
- **AI Chat Doesn't Respond (429/404 Errors):**
  OpenRouter free models are heavily rate-limited. Ensure the `services.py` file uses active fallback models (e.g., `poolside/laguna-xs.2:free`).
