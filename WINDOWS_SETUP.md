# 🌸 EmpowerHer — Windows Setup Guide

A complete step-by-step guide to clone, install, and run EmpowerHer on a **Windows** machine.

---

## 📋 What You Need to Install First (Prerequisites)

You need 4 things installed before starting. Do these **once** on your PC:

---

### ✅ 1. Python 3.10 or Higher

1. Go to: https://www.python.org/downloads/windows/
2. Click **"Download Python 3.x.x"** (the big yellow button)
3. Run the installer
4. ⚠️ **IMPORTANT:** On the first screen, check the box **"Add Python to PATH"** before clicking Install Now

   ![Add Python to PATH checkbox must be checked]

5. Click **"Install Now"**
6. After install, verify it worked — open **Command Prompt** and type:
   ```
   python --version
   ```
   You should see something like: `Python 3.12.3`

---

### ✅ 2. Node.js 18 or Higher

1. Go to: https://nodejs.org/
2. Click **"LTS"** (the left green button — this is the stable version)
3. Run the `.msi` installer — click Next → Next → Install (all defaults are fine)
4. After install, verify — open **Command Prompt** and type:
   ```
   node --version
   npm --version
   ```
   You should see version numbers like `v20.x.x` and `10.x.x`

---

### ✅ 3. Git

1. Go to: https://git-scm.com/download/win
2. Download and run the installer
3. All default options are fine — just keep clicking Next → Install
4. After install, verify — open **Command Prompt** and type:
   ```
   git --version
   ```
   You should see: `git version 2.x.x.windows.x`

---

### ✅ 4. Redis (for Background Report Generation)

Native Redis does not officially support Windows. Use **one** of these two options:

#### Option A — WSL2 (Recommended, Free)

WSL2 lets you run Linux inside Windows. Redis works perfectly inside it.

**Step 1:** Open **PowerShell as Administrator** (right-click PowerShell → Run as Administrator) and run:
```powershell
wsl --install
```
Restart your computer when prompted.

**Step 2:** After restart, open **Ubuntu** from the Start Menu. Set a username and password when asked.

**Step 3:** Inside Ubuntu, install and start Redis:
```bash
sudo apt update
sudo apt install redis-server -y
sudo service redis-server start
```

**Step 4:** Verify Redis is working:
```bash
redis-cli ping
```
You should see: `PONG` ✅

> 💡 **Every time you restart your PC**, open Ubuntu and run `sudo service redis-server start` before using EmpowerHer.

#### Option B — Memurai (Windows Native Redis, Easier)

1. Go to: https://www.memurai.com/get-memurai
2. Download and install Memurai
3. It runs automatically as a Windows service — no extra steps needed!
4. Verify: Open **Command Prompt** and type:
   ```
   memurai-cli ping
   ```
   You should see: `PONG` ✅

---

### ✅ 5. GTK3 (Required for PDF Report Generation)

WeasyPrint (the PDF library) needs GTK3 on Windows.

1. Go to: https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer/releases
2. Download the latest `gtk3-runtime-x.x.x-x-x-x-ts-win64.exe`
3. Run the installer — all default options are fine
4. **IMPORTANT:** After install, add GTK to your PATH:
   - Open **Start Menu** → search for **"Environment Variables"** → click **"Edit the system environment variables"**
   - Click **"Environment Variables..."** button
   - Under **"System variables"**, find **"Path"** → click **Edit**
   - Click **"New"** and add: `C:\Program Files\GTK3-Runtime Win64\bin`
   - Click OK → OK → OK
5. Restart your computer (or at least close and reopen all terminals)

---

## 🚀 Installation — Step by Step

Now that prerequisites are ready, let's set up the project.

> 💡 **Tip:** Open **Windows Terminal** or **Command Prompt**. You'll need **3 separate terminal windows** running by the end. Keep them all open!

---

### Step 1 — Clone the Repository

Open **Command Prompt** and run:

```cmd
git clone https://github.com/abhylash/EmpowerHer_project.git
cd EmpowerHer_project
```

You'll now have a folder called `EmpowerHer_project` with two subfolders: `backend` and `frontend`.

---

### Step 2 — Backend Setup

In the **same terminal**, go into the backend folder:

```cmd
cd backend
```

#### 2.1 — Create a Virtual Environment

```cmd
python -m venv venv
```

This creates a folder called `venv` inside `backend`. This keeps Python packages for this project separate from the rest of your system.

#### 2.2 — Activate the Virtual Environment

```cmd
venv\Scripts\activate
```

✅ You should now see `(venv)` at the start of your terminal line, like this:
```
(venv) C:\Users\YourName\EmpowerHer_project\backend>
```

> ⚠️ If you get an error like **"execution of scripts is disabled"**, run this first in **PowerShell as Administrator**:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```
> Then try activating again.

#### 2.3 — Install Python Dependencies

```cmd
pip install -r requirements.txt
```

This installs Django, Celery, WeasyPrint, and all other required packages. It may take 2–5 minutes.

#### 2.4 — Upgrade WeasyPrint (Very Important!)

```cmd
pip install --upgrade weasyprint
```

> ⚠️ This step is **required**. Without it, PDF report generation will crash with a `TypeError`.

#### 2.5 — Create the `.env` File

The `.env` file stores your secret configuration. Create it inside the `backend` folder:

```cmd
type nul > .env
```

Now open the `.env` file using Notepad:

```cmd
notepad .env
```

Paste the following into Notepad and save:

```
DEBUG=True
SECRET_KEY=empowerher-super-secret-key-change-this-in-production
REDIS_URL=redis://localhost:6379/0
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

Save the file (`Ctrl + S`) and close Notepad.

> 🔑 **How to get your OpenRouter API Key:**
> 1. Go to https://openrouter.ai/ and click **Sign Up**
> 2. After signing in, go to https://openrouter.ai/settings/keys
> 3. Click **"Create Key"** → give it any name → click **Create**
> 4. Copy the key (it starts with `sk-or-v1-...`)
> 5. Replace `your-openrouter-api-key-here` in your `.env` file with this key

#### 2.6 — Set Up the Database

Run database migrations (this creates all the tables):

```cmd
python manage.py migrate
```

You'll see a list of migrations being applied. This is normal. ✅

#### 2.7 — Load Government Schemes Data

```cmd
python manage.py seed_schemes
```

This populates the database with government welfare schemes.

#### 2.8 — (Optional) Create an Admin Account

```cmd
python manage.py createsuperuser
```

Enter a username, email (can be blank), and password. You can then visit `http://127.0.0.1:8000/admin` to manage data.

#### 2.9 — Start the Django Backend Server

```cmd
python manage.py runserver
```

✅ You should see:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

🔒 **Keep this terminal window open.** Do not close it.

---

### Step 3 — Start the Background Worker (For PDF Reports)

> ⚠️ **This is required for Health Report PDF generation.** Without it, reports will stay on "pending" status forever.

Open a **NEW Command Prompt window** (keep the previous one open).

Navigate to the backend folder and activate the virtual environment again:

```cmd
cd EmpowerHer_project\backend
venv\Scripts\activate
```

Now start the Celery worker:

```cmd
celery -A empowerher worker -l info --pool=solo
```

> ⚠️ The `--pool=solo` flag is **required on Windows**. Without it, Celery will crash.

✅ You should see something like:
```
[tasks]
  . apps.reports.tasks.generate_pdf_report

celery@your-computer ready.
```

🔒 **Keep this terminal window open too.** Do not close it.

---

### Step 4 — Frontend Setup (React)

Open a **THIRD Command Prompt window**.

Navigate to the frontend folder:

```cmd
cd EmpowerHer_project\frontend
```

#### 4.1 — Install Node.js Dependencies

```cmd
npm install
```

This downloads all the React packages. It may take 1–3 minutes on the first run.

#### 4.2 — Start the React Development Server

```cmd
npm run dev -- --port 3001
```

✅ You should see:
```
  VITE v5.x.x  ready in Xs

  ➜  Local:   http://localhost:3001/
```

🔒 **Keep this terminal window open.**

---

## 🌐 Open the App in Your Browser

Once all **3 terminals** are running, open your browser and go to:

**👉 http://localhost:3001**

You should see the EmpowerHer landing page! 🎉

---

## 📋 Terminal Summary — What Should Be Running

| Terminal | Location | Command | Status |
|----------|----------|---------|--------|
| Terminal 1 | `backend\` | `python manage.py runserver` | Django API |
| Terminal 2 | `backend\` | `celery -A empowerher worker -l info --pool=solo` | PDF worker |
| Terminal 3 | `frontend\` | `npm run dev -- --port 3001` | React UI |

---

## 👤 First Time Using the App

1. Open **http://localhost:3001**
2. Click **"Get Started"** → **"Register"**
3. Fill in your **name, email, username, and password**
4. After registering, you'll see the **Onboarding** page — fill in your age, state, health conditions etc.
5. You'll be redirected to your **Dashboard** — all features are now available!

---

## ❓ Troubleshooting

### ❌ `python` is not recognized
Python was not added to PATH during installation. Uninstall Python, reinstall it, and **make sure to check "Add Python to PATH"** on the first screen.

### ❌ `venv\Scripts\activate` gives an error about scripts being disabled
Run this in **PowerShell as Administrator**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then try activating again.

### ❌ `pip install -r requirements.txt` fails
Make sure the virtual environment is activated. You should see `(venv)` at the start of your terminal line.

### ❌ Reports stuck on "Generating..." or "Pending" forever
The Celery worker (Terminal 2) is not running or has crashed. Go to Terminal 2 and check. If it's closed, reopen it and run:
```cmd
cd EmpowerHer_project\backend
venv\Scripts\activate
celery -A empowerher worker -l info --pool=solo
```

### ❌ PDF Report crashes with `TypeError: PDF.__init__() takes 1 positional argument`
Run this in Terminal 2 (with venv activated):
```cmd
pip install --upgrade weasyprint
```
Then restart the Celery worker.

### ❌ AI Chat shows error or doesn't respond
- Check that your `OPENROUTER_API_KEY` is correctly set in `backend\.env`
- The free tier models can sometimes be rate-limited — wait 30 seconds and try again

### ❌ App shows blank white screen
Hard refresh the browser to clear the service worker cache:
```
Ctrl + Shift + R
```

### ❌ `redis-cli ping` fails / Connection refused
If using WSL2, open Ubuntu and run:
```bash
sudo service redis-server start
```
If using Memurai, check that the Memurai service is running in Windows Services.

### ❌ Port 3001 is already in use
```cmd
npx kill-port 3001
npm run dev -- --port 3001
```

### ❌ `python manage.py migrate` fails with database error
Delete the old database and retry:
```cmd
del db.sqlite3
python manage.py migrate
```

---

## 🔄 Starting the App Again (Next Time)

You don't need to repeat the installation steps. Every time you want to use EmpowerHer, just open **3 terminals** and run:

**Terminal 1 — Backend:**
```cmd
cd EmpowerHer_project\backend
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 — Celery Worker:**
```cmd
cd EmpowerHer_project\backend
venv\Scripts\activate
celery -A empowerher worker -l info --pool=solo
```

**Terminal 3 — Frontend:**
```cmd
cd EmpowerHer_project\frontend
npm run dev -- --port 3001
```

Then open **http://localhost:3001** in your browser.

---

## 📄 Other Documentation

| File | Contents |
|------|----------|
| `README.md` | Full setup guide for all operating systems |
| `FEATURES.md` | Detailed explanation of every feature with real-life examples |

---

**EmpowerHer — Your Health. Your Story.** 🌸
