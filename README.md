# 🌸 EmpowerHer — Complete Windows Setup Guide (For Beginners)

> **This guide is written for someone who has NEVER set up a coding project before.**
> Every single step is explained in detail. Follow them in order and you will have the project running without any errors.

---

## 📌 What is This Project?

**EmpowerHer** is a women's health platform website. It has:
- Period tracker
- Food and nutrition tracker
- Mood journal
- Pregnancy tracker
- AI Health chatbot
- Government scheme finder
- PDF health report generator

It is built in two parts:
- **Backend** — the server (Django/Python) that stores data and handles logic
- **Frontend** — the website (React) that you see in your browser

Both need to be running at the same time.

---

## 🖥️ What You Need (Prerequisites)

You need to install **5 things** on your Windows PC before you can run this project. Do each one in order.

---

### 🔧 STEP 0.1 — Install Python

1. Open your browser and go to: **https://www.python.org/downloads/windows/**
2. Click the big yellow button that says **"Download Python 3.x.x"**
3. Open the downloaded `.exe` file
4. ⚠️ **VERY IMPORTANT — Before clicking anything**, look at the bottom of the installer screen. You will see a checkbox that says **"Add Python to PATH"**. **CHECK THAT BOX.** If you miss this, nothing will work.
5. Now click **"Install Now"**
6. Wait for it to finish. Click **"Close"**

**✅ How to verify it worked:**
- Press `Windows + R`, type `cmd`, press Enter (this opens Command Prompt)
- Type this and press Enter:
  ```
  python --version
  ```
- You should see something like: `Python 3.12.3`
- If you see `'python' is not recognized` → you missed the PATH checkbox. Uninstall Python and reinstall it, this time checking that box.

---

### 🔧 STEP 0.2 — Install Node.js

1. Open your browser and go to: **https://nodejs.org/**
2. Click the button on the **LEFT** that says **"LTS"** (this is the stable version)
3. Open the downloaded `.msi` file
4. Keep clicking **Next → Next → Next → Install** (all defaults are fine)
5. Click **Finish**

**✅ How to verify it worked:**
- Open a new Command Prompt (close the old one and open again)
- Type:
  ```
  node --version
  ```
  You should see: `v20.x.x` or similar
- Also type:
  ```
  npm --version
  ```
  You should see: `10.x.x` or similar

---

### 🔧 STEP 0.3 — Install Git

1. Open your browser and go to: **https://git-scm.com/download/win**
2. The download should start automatically. If not, click **"Click here to download"**
3. Open the downloaded `.exe` file
4. Keep clicking **Next** on every screen — all default settings are fine
5. Click **Install**, then **Finish**

**✅ How to verify it worked:**
- Open a new Command Prompt
- Type:
  ```
  git --version
  ```
  You should see: `git version 2.x.x.windows.x`

---

### 🔧 STEP 0.4 — Install Redis (for Background Tasks)

Redis is needed to generate PDF health reports. On Windows, the easiest way is using **Memurai** (a Windows-compatible version of Redis).

1. Open your browser and go to: **https://www.memurai.com/get-memurai**
2. Fill in your email and download the installer
3. Open the downloaded `.exe` file and install it (all defaults are fine)
4. Memurai will automatically run as a Windows background service — you do not need to start it manually

**✅ How to verify it worked:**
- Open Command Prompt and type:
  ```
  memurai-cli ping
  ```
  You should see: `PONG`

> ⚠️ If `memurai-cli` is not found, try:
  ```
  redis-cli ping
  ```
  Either one should say `PONG`

---

### 🔧 STEP 0.5 — Install GTK3 (for PDF Generation)

The PDF report generator needs a library called GTK3.

1. Go to: **https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer/releases**
2. Find the latest release and download the file named something like:
   `gtk3-runtime-x.x.x-x-x-x-ts-win64.exe`
3. Open and run the installer — click **Next → Next → Install → Finish** (all defaults)

**Now add GTK3 to your system PATH** (this is important):

1. Click the **Windows Start button** and search for: **"environment variables"**
2. Click **"Edit the system environment variables"**
3. A window opens — click the button **"Environment Variables..."** at the bottom
4. In the bottom section called **"System variables"**, scroll down and find **"Path"**
5. Click on **"Path"** to select it, then click **"Edit..."**
6. A new window opens — click **"New"**
7. Type exactly: `C:\Program Files\GTK3-Runtime Win64\bin`
8. Click **OK** → **OK** → **OK** (close all three windows)
9. ⚠️ **Restart your computer** after this step

**✅ After restarting, verify:**
- Open Command Prompt and type:
  ```
  python -c "import ctypes; ctypes.CDLL('libgdk-3-0.dll')"
  ```
  If no error appears, GTK3 is working ✅

---

## 📥 STEP 1 — Download the Project (Clone from GitHub)

Now you will download the project code from GitHub.

1. Open **Command Prompt** (press `Windows + R`, type `cmd`, press Enter)
2. Decide where you want to save the project. For example, your Desktop:
   ```
   cd Desktop
   ```
3. Now clone (download) the project:
   ```
   git clone https://github.com/abhylash/EmpowerHer_project.git
   ```
4. Wait for it to finish downloading
5. Go into the project folder:
   ```
   cd EmpowerHer_project
   ```

You should now be inside the project folder. Type `dir` and press Enter — you should see `backend` and `frontend` folders listed.

---

## ⚙️ STEP 2 — Set Up the Backend (Django / Python)

The backend is the server that powers everything. Follow every sub-step carefully.

### 2.1 — Navigate to the Backend Folder

```cmd
cd backend
```

### 2.2 — Create a Virtual Environment

A virtual environment is like a separate clean space for Python packages — so they don't mix with other projects on your PC.

```cmd
python -m venv venv
```

Wait a few seconds. You will see a new folder called `venv` appear inside `backend`.

### 2.3 — Activate the Virtual Environment

```cmd
venv\Scripts\activate
```

✅ **How to know it worked:** Look at the start of your terminal line — it should now show `(venv)` like this:
```
(venv) C:\Users\YourName\Desktop\EmpowerHer_project\backend>
```

> ❌ **If you get an error about "scripts being disabled":**
> 1. Close Command Prompt
> 2. Right-click the **Start button** → **"Windows PowerShell (Admin)"** or **"Terminal (Admin)"**
> 3. Run this command:
>    ```
>    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
>    ```
> 4. Type `Y` and press Enter
> 5. Close PowerShell and reopen regular Command Prompt
> 6. Navigate back: `cd Desktop\EmpowerHer_project\backend`
> 7. Try `venv\Scripts\activate` again

### 2.4 — Install All Python Packages

```cmd
pip install -r requirements.txt
```

This will download and install all the required libraries. It may take **3–7 minutes**. You will see a lot of text scrolling — this is normal. Wait for it to finish.

✅ You know it's done when you see your command prompt back at `(venv) C:\...>`

### 2.5 — Upgrade WeasyPrint (Very Important!)

```cmd
pip install --upgrade weasyprint
```

> ⚠️ Do NOT skip this step. The version in `requirements.txt` has a bug that crashes PDF generation. This fixes it.

### 2.6 — Create the Secret Configuration File

The project needs a file called `.env` (short for "environment") to store secret settings like your API key.

**Create the file:**
```cmd
type nul > .env
```

**Open it in Notepad:**
```cmd
notepad .env
```

A blank Notepad window will open. **Copy and paste ALL of this** into Notepad:

```
DEBUG=True
SECRET_KEY=empowerher-super-secret-key-change-this-in-production
REDIS_URL=redis://localhost:6379/0
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

**Now save the file:** Press `Ctrl + S`, then close Notepad.

> 🔑 **Getting your OpenRouter API Key (for AI chat to work):**
> 1. Open your browser and go to: **https://openrouter.ai/**
> 2. Click **"Sign In"** → sign up with Google or email (it's free)
> 3. After logging in, go to: **https://openrouter.ai/settings/keys**
> 4. Click **"Create Key"**
> 5. Give it any name (e.g., "EmpowerHer") and click **Create**
> 6. **Copy the key** (it looks like `sk-or-v1-abc123...`)
> 7. Go back to Notepad, open `backend\.env`, and replace `your-openrouter-api-key-here` with your actual key
> 8. Save the file again

### 2.7 — Set Up the Database

Run this command to create all the database tables:

```cmd
python manage.py migrate
```

You will see a list of items like:
```
Applying auth.0001_initial... OK
Applying auth_app.0001_initial... OK
...
```
This is normal. Wait until it finishes. ✅

### 2.8 — Load Government Schemes Data

```cmd
python manage.py seed_schemes
```

This loads all the government welfare schemes into the database so they show up in the app.

### 2.9 — Start the Django Server

```cmd
python manage.py runserver
```

✅ **You should see:**
```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

🟢 **The backend is now running!**

> 🔒 **DO NOT CLOSE THIS TERMINAL WINDOW.** Leave it running and open a new Command Prompt for the next step.

---

## ⚙️ STEP 3 — Start the Background Worker (For PDF Reports)

This is a separate process that handles PDF generation in the background.

**Open a brand new Command Prompt window** (keep the old one open):
- Press `Windows + R` → type `cmd` → press Enter

Navigate to the backend folder:
```cmd
cd Desktop\EmpowerHer_project\backend
```

Activate the virtual environment (you must do this in every new terminal):
```cmd
venv\Scripts\activate
```

You should see `(venv)` again. Now start the worker:

```cmd
celery -A empowerher worker -l info --pool=solo
```

> ⚠️ The `--pool=solo` part is **required on Windows**. Without it, Celery will crash immediately.

✅ **You should see something like:**
```
[tasks]
  . apps.reports.tasks.generate_pdf_report

[2026-xx-xx xx:xx:xx,xxx: INFO/MainProcess] celery@your-pc ready.
```

🟢 **The background worker is now running!**

> 🔒 **DO NOT CLOSE THIS TERMINAL WINDOW EITHER.** Open a third new one for the frontend.

---

## ⚙️ STEP 4 — Set Up the Frontend (React / Website)

**Open a third new Command Prompt window:**
- Press `Windows + R` → type `cmd` → press Enter

Navigate to the frontend folder:
```cmd
cd Desktop\EmpowerHer_project\frontend
```

### 4.1 — Install Node.js Packages

```cmd
npm install
```

This downloads all the website packages. It may take **2–5 minutes**. A lot of text will scroll — this is normal. Wait until you see your prompt back.

### 4.2 — Start the Website

```cmd
npm run dev -- --port 3001
```

✅ **You should see:**
```
  VITE v5.x.x  ready in Xs

  ➜  Local:   http://localhost:3001/
  ➜  Network: use --host to expose
```

🟢 **The frontend is now running!**

---

## 🌐 STEP 5 — Open the App

Open your browser (Chrome/Edge/Firefox) and go to:

# 👉 http://localhost:3001

You should see the **EmpowerHer** landing page! 🎉

---

## 👤 STEP 6 — Create Your Account

1. Click **"Get Started"** on the landing page
2. Click **"Register"**
3. Fill in:
   - Full Name
   - Email address
   - Username (any name, no spaces)
   - Password (at least 8 characters)
4. Click **"Register"**
5. You will be taken to the **Onboarding** page — fill in your details:
   - Age
   - State you live in
   - Health conditions (PCOD, anemia, etc. if any)
   - Preferred language
6. Click **"Save"** — you'll now see your **Dashboard!**

---

## 📊 Summary — 3 Terminals Must Stay Open

Every time you use the app, you need **3 Command Prompt windows running**:

| Window | Folder | Command | What it does |
|--------|--------|---------|-------------|
| Terminal 1 | `backend\` | `python manage.py runserver` | Runs the Django API server |
| Terminal 2 | `backend\` | `celery -A empowerher worker -l info --pool=solo` | Generates PDF reports |
| Terminal 3 | `frontend\` | `npm run dev -- --port 3001` | Runs the React website |

---

## 🔄 Starting the App Next Time

You only need to do the full setup **once**. From next time, just do this:

**Terminal 1 — Open Command Prompt:**
```cmd
cd Desktop\EmpowerHer_project\backend
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 — Open another Command Prompt:**
```cmd
cd Desktop\EmpowerHer_project\backend
venv\Scripts\activate
celery -A empowerher worker -l info --pool=solo
```

**Terminal 3 — Open another Command Prompt:**
```cmd
cd Desktop\EmpowerHer_project\frontend
npm run dev -- --port 3001
```

Then go to **http://localhost:3001** in your browser.

---

## 🔴 Common Errors and How to Fix Them

### ❌ Error: `'python' is not recognized as an internal or external command`
**Cause:** Python was not added to PATH during installation.
**Fix:** Uninstall Python → reinstall it → **CHECK the "Add Python to PATH" box** on the first screen.

---

### ❌ Error: `venv\Scripts\activate` → "running scripts is disabled"
**Fix:**
1. Right-click Start → **Windows Terminal (Admin)** or **PowerShell (Admin)**
2. Run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Press `Y` then Enter. Close and reopen normal Command Prompt.

---

### ❌ Error: `pip install` fails with `Microsoft Visual C++ 14.0 required`
**Fix:** Download and install the **Visual C++ Build Tools**:
- Go to: https://visualstudio.microsoft.com/visual-cpp-build-tools/
- Download and install "Build Tools for Visual Studio"
- Check **"C++ build tools"** and install

---

### ❌ Error: Reports stay on "Generating..." or "Pending" forever
**Cause:** The Celery worker (Terminal 2) is not running.
**Fix:** Open a new Command Prompt and run:
```cmd
cd Desktop\EmpowerHer_project\backend
venv\Scripts\activate
celery -A empowerher worker -l info --pool=solo
```

---

### ❌ Error: `TypeError: PDF.__init__() takes 1 positional argument but 3 were given`
**Cause:** Old WeasyPrint version bug.
**Fix:** In Terminal 2 (with venv activated):
```cmd
pip install --upgrade weasyprint
```
Restart the Celery worker afterwards.

---

### ❌ Error: AI Chat shows "I'm having trouble connecting right now"
**Cause:** Missing or wrong OpenRouter API key.
**Fix:**
1. Open `backend\.env` in Notepad
2. Make sure `OPENROUTER_API_KEY=` has your real key (not the placeholder text)
3. Save the file and restart Terminal 1 (Ctrl+C then `python manage.py runserver` again)

---

### ❌ Error: Blank white screen on http://localhost:3001
**Fix:** Do a hard refresh to clear the browser cache:
```
Ctrl + Shift + R
```

---

### ❌ Error: `redis-cli ping` → "Could not connect to Redis"
**Fix:** Open the **Services** app in Windows:
1. Press `Windows + R` → type `services.msc` → Enter
2. Find **"Memurai"** in the list
3. Right-click → **Start**

---

### ❌ Error: `python manage.py migrate` → `no such table` or database errors
**Fix:** Delete the old database and start fresh:
```cmd
del db.sqlite3
python manage.py migrate
python manage.py seed_schemes
```

---

### ❌ Error: Port 3001 already in use
**Fix:**
```cmd
npx kill-port 3001
npm run dev -- --port 3001
```

---

## 📁 What Each Folder Does

```
EmpowerHer_project/
│
├── backend/                    ← Python/Django server
│   ├── apps/
│   │   ├── auth_app/           ← Login, register, user profiles
│   │   ├── cycles/             ← Period tracking
│   │   ├── fitness/            ← Food and nutrition logging
│   │   ├── mental/             ← Mood journal
│   │   ├── pregnancy/          ← Pregnancy tracker
│   │   ├── schemes/            ← Government schemes database
│   │   ├── reports/            ← PDF health report generation
│   │   └── ai_service/         ← AI chat (OpenRouter)
│   ├── empowerher/             ← Django main settings
│   ├── templates/              ← HTML template for PDF reports
│   ├── requirements.txt        ← List of Python packages to install
│   └── .env                    ← Your secret config (you create this)
│
└── frontend/                   ← React website
    ├── src/
    │   ├── pages/              ← All website pages
    │   ├── components/         ← Shared components (Navbar, Footer)
    │   ├── api/                ← API communication
    │   └── store/              ← App-wide state management
    ├── public/locales/         ← Language translation files
    └── package.json            ← List of JavaScript packages to install
```

---

## 🌐 All Pages in the App

| URL to visit | What it shows |
|-------------|--------------|
| http://localhost:3001 | Home / Landing page |
| http://localhost:3001/register | Create new account |
| http://localhost:3001/login | Log in |
| http://localhost:3001/dashboard | Your health overview |
| http://localhost:3001/cycles | Period tracker |
| http://localhost:3001/fitness | Food & nutrition logger |
| http://localhost:3001/mental | Mood journal |
| http://localhost:3001/pregnancy | Pregnancy tracker |
| http://localhost:3001/schemes | Government schemes |
| http://localhost:3001/reports | Generate PDF health report |
| http://localhost:3001/ai-chat | AI Health Assistant chat |
| http://127.0.0.1:8000/admin | Django admin panel (backend) |

---

## 📬 Need Help?

- Read `FEATURES.md` to understand what each feature does in detail
- Open an issue at: https://github.com/abhylash/EmpowerHer_project/issues

---

**EmpowerHer — Your Health. Your Story.** 🌸
