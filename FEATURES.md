# EmpowerHer — Complete Feature Guide 🌸

> **EmpowerHer** is a full-stack AI-powered women's health and wellness platform designed for the Indian context. This document explains every feature in detail, with real-life examples to illustrate how each one works.

---

## Table of Contents

1. [User Registration & Onboarding](#1-user-registration--onboarding)
2. [Menstrual Cycle Tracker](#2-menstrual-cycle-tracker)
3. [Fitness & Nutrition Logger](#3-fitness--nutrition-logger)
4. [Mental Wellness & Mood Journal](#4-mental-wellness--mood-journal)
5. [Pregnancy Tracker](#5-pregnancy-tracker)
6. [Government Schemes Discovery](#6-government-schemes-discovery)
7. [AI Health Assistant (Chat)](#7-ai-health-assistant-chat)
8. [Health Report Generator](#8-health-report-generator)
9. [Dashboard — Health Overview](#9-dashboard--health-overview)
10. [Multi-Language Support](#10-multi-language-support)
11. [Progressive Web App (PWA)](#11-progressive-web-app-pwa)
12. [Security & Authentication](#12-security--authentication)

---

## 1. User Registration & Onboarding

### What it does
Users can create a secure account and then go through a guided onboarding flow to fill in their personal health profile. This profile is the foundation that powers all personalised recommendations across the platform.

### How it works — Step by Step

**Registration:**
1. The user fills in their name, email address, username, and password.
2. The backend creates their account using Django's built-in `User` model, hashes the password securely using PBKDF2-SHA256, and automatically generates a JWT access token + refresh token pair.
3. The tokens are returned to the browser and stored in `localStorage` under the key `empowerher-auth` via Zustand's persist middleware.

**Onboarding:**
After registering, the user is guided to complete their health profile, which includes:
- **Age** — used to filter eligible government schemes
- **State** — used for state-specific schemes (e.g., Karnataka schemes for Karnataka residents)
- **Marital status** — impacts pregnancy and scheme eligibility checks
- **Health conditions** — e.g., PCOD, anemia, diabetes
- **Preferred language** — determines the default language for the entire app

### Real-Life Example
> *Priya, a 26-year-old woman from Bangalore, registers with her email and creates a profile. She mentions she has PCOD and lives in Karnataka. EmpowerHer immediately filters and shows her schemes like "Beti Bachao Beti Padhao" and Karnataka-specific health schemes. Her AI chat also gains extra context about PCOD to give her more relevant advice.*

---

## 2. Menstrual Cycle Tracker

### What it does
Allows women to log their menstrual period dates, flow level, cramp intensity, and mood — and then uses historical data to predict future cycles, ovulation windows, and the current cycle phase.

### How it works — Step by Step

**Logging a Period:**
1. User clicks "Log New Period."
2. Fills in:
   - **Start Date** — the date the period began (e.g., 2026-05-01)
   - **Flow Level** — Light, Medium, or Heavy (color-coded in the UI)
   - **Cramp Score** — a slider from 1 to 10
   - **Mood** — free text (e.g., "irritable," "tired")
   - **Notes** — any additional observations
3. Data is saved to the backend `CycleLog` model linked to the user's profile.

**Predictions:**
The backend's `/api/cycles/prediction/` endpoint calculates:
- **Next Period Date** — based on the average cycle length across all logged periods
- **Ovulation Window** — calculated as (average cycle length − 14) days after period start
- **Current Cycle Phase** — one of four phases:
  - 🔴 **Menstrual** (Days 1–5): Shedding of uterine lining
  - 🟢 **Follicular** (Days 6–12): Follicle maturation
  - 🔵 **Ovulatory** (Days 13–15): Egg release — highest fertility
  - 🟣 **Luteal** (Days 16–28): Body prepares for possible pregnancy

**Visual Chart:**
A line chart (Recharts) displays the last several cycle lengths and cramp scores over time, letting the user visually spot patterns.

### Real-Life Example
> *Ananya has logged periods for 4 months. The app calculates her average cycle is 27 days. On May 7th, her last period started. EmpowerHer predicts her next period will begin around June 3rd and her ovulation window will be May 20–22. It also tells her she's currently in the "Luteal" phase, which explains the bloating and mood dips she's been feeling.*

---

## 3. Fitness & Nutrition Logger

### What it does
Tracks daily food intake, calculates macro-nutrients (calories, protein, carbs, fat), shows a daily nutrition summary, and includes an **AI-powered photo food analysis** feature — allowing users to photograph their meal and get instant nutrition data.

### How it works — Step by Step

**Mode 1: Search & Log**
1. User types in the search bar (e.g., "Dal").
2. A built-in Indian food database shows matching items with their calorie and macro values:
   - Rice: 130 kcal | 2.7g protein | 28g carbs | 0.3g fat
   - Roti: 104 kcal | 3.1g protein | 21g carbs | 0.4g fat
   - Dal: 116 kcal | 8g protein | 20g carbs | 0.4g fat
   - Sambar, Curd, Salad, Buttermilk, Banana, Apple — all included
3. User clicks "Add to Log" for each food item.
4. Selects meal type (Breakfast / Lunch / Dinner / Snack).
5. Submits — the meal is saved to the `MealLog` model in the backend.

**Mode 2: AI Photo Detection**
1. User taps "Photo Detection" tab.
2. Uploads a photo of their plate (PNG/JPG, up to 10MB).
3. The image is sent (as Base64) to the backend `/api/fitness/meals/analyse-photo/` endpoint.
4. The backend calls OpenRouter AI (Google Gemma model) with a dietitian prompt to identify all visible Indian dishes and return a JSON array with `dish`, `calories_kcal`, `protein_g`, `carb_g`, and `fat_g`.
5. The detected dishes appear in the UI and can be added to the log with one click.

**Nutrition Summary Sidebar:**
Four progress bars track daily intake against goals:
- Calories: X / 2000 kcal
- Protein: X / 50g
- Carbs: X / 250g
- Fat: X / 65g

### Real-Life Example
> *Kavitha has a plate of Rice, Dal, and Sabji for lunch. She takes a photo of her plate and taps "Analyze." Within a few seconds, EmpowerHer identifies 3 dishes and shows their calorie counts. She taps "Add to Log" for each item. Later, she sees her daily protein bar is only at 30% and decides to add a glass of Buttermilk for a protein boost.*

---

## 4. Mental Wellness & Mood Journal

### What it does
Allows users to log their daily mood on a 5-point emoji scale with optional written notes, visualize mood trends over 14 days in an area chart, and trigger an **AI pattern analysis** that identifies emotional patterns, PMS-related mood dips, and weekly triggers.

### How it works — Step by Step

**Logging a Mood:**
1. The user is presented with 5 emoji buttons representing mood scores:
   - 😊 **10/10** — Excellent
   - 🙂 **8/10** — Good
   - 😐 **5/10** — Okay
   - 😔 **3/10** — Low
   - 😢 **1/10** — Very Low
2. User clicks their current mood and optionally adds a text note (e.g., "Feeling anxious before presentation at work").
3. Data is submitted to the backend with today's date and saved to the `MoodLog` model.

**Mood Trend Chart:**
An area chart (Recharts) shows the last 14 days of mood scores in reverse chronological order. The user can visually see weeks when their mood dips (often pre-menstrual) vs. peaks.

**AI Insights Panel:**
When the user clicks "Analyze," the backend calls OpenRouter AI with a detailed prompt containing all mood log data (JSON). The AI returns a warm, 3-sentence insight — for example:
- Identifying weekly patterns (e.g., Mondays are consistently lower)
- Spotting pre-menstrual mood dips
- Suggesting coping strategies or patterns to watch

**Mood Statistics:**
- Average mood across all entries
- Total entries logged
- Best single day score
- Trend direction (Improving ↗️ / Declining ↘️)

### Real-Life Example
> *Rekha notices she's been feeling very low every month in the last 7–10 days before her period. She logs her moods daily for a month. When she clicks "Analyze," the AI tells her: "Your data shows a consistent dip in mood scores between Days 21 and 27 of your cycle — this is a classic pattern of PMDD or PMS. During these days, light exercise and magnesium-rich foods like bananas and nuts can help stabilize your mood."*

---

## 5. Pregnancy Tracker

### What it does
Week-by-week pregnancy tracking from the Last Menstrual Period (LMP) date, showing baby development milestones, the baby's size compared to common fruits/vegetables, maternal tips, and a real-time symptom checker that flags potential danger signs.

### How it works — Step by Step

**Setting Up Tracking:**
1. User enters their **Last Menstrual Period (LMP)** date.
2. The backend calculates:
   - **Current week** of pregnancy (weeks since LMP)
   - **Estimated Due Date (EDD)** = LMP + 280 days
   - Days remaining until EDD
3. Data is saved to the `PregnancyProfile` model.

**Weekly Development Card:**
Each week displays:
- **Baby Size** — compared to a fruit or vegetable (e.g., Week 8 → 🫐 Blueberry, Week 20 → 🍌 Banana, Week 40 → 🎃 Pumpkin)
- **Baby Comparison** — descriptive size text
- **Development** — what is developing this week (e.g., "Heart is now beating regularly. Tiny fingers are forming.")
- **Maternal Tip** — advice for the mother's comfort that week
- **Nutrition Tip** — specific nutrition advice (e.g., "Increase folic acid intake")
- **Trimester Badge** — First (Weeks 1–12), Second (Weeks 13–28), Third (Weeks 29–40)
- **Progress Bar** — visual showing X out of 40 weeks

**Symptom Checker:**
16 common pregnancy symptoms are displayed as checkboxes:
- Normal: Morning sickness, Fatigue, Back pain, Headaches, Heartburn, Frequent urination, Food cravings, Mood swings
- **Danger Signs** (flagged in red): Bleeding, Severe headache, Reduced fetal movement, Blurred vision, Fever, Dizziness, Chest pain, Swelling

When the user selects symptoms and taps "Analyze Symptoms," the backend classifies them:
- ✅ **No Immediate Danger** — Normal symptoms, reassuring message
- ⚠️ **Danger Signs Detected** — Lists the specific dangerous symptoms with an urgent message to contact a healthcare provider

**Emergency Contacts Sidebar:**
- 🚨 Emergency: 108
- 🤱 Pregnancy Helpline: 1800-11-6263

### Real-Life Example
> *Meera is at Week 22 of her pregnancy. EmpowerHer shows her that her baby is the size of a 🥕 Carrot. The development card says: "Your baby's senses are developing rapidly and they can now hear your voice." The nutrition tip suggests she increase her iron intake. That evening, she notices reduced fetal movement and checks the symptom checker — the app immediately flags it as a danger sign and tells her to contact her doctor right away.*

---

## 6. Government Schemes Discovery

### What it does
Surfaces central and state government welfare schemes that the logged-in user may be eligible for, based on their age, state, marital status, and health conditions entered during onboarding. Users can search, filter, view detailed eligibility rules, and apply directly via official government portals.

### How it works — Step by Step

**Eligibility Matching:**
The backend's `/api/schemes/eligible/` endpoint compares the user's profile against the `eligibility_rules` JSON field of every active scheme in the database. Schemes are matched if the user meets the age range, state, and category requirements.

**Scheme Card — What you see:**
- **Name** and **Full Name** of the scheme
- **Benefit Amount** — e.g., "₹6,000", "₹1 Lakh"
- **Benefit Description** — what the benefit covers
- **Applicable To** tags — e.g., `Pregnant Women`, `BPL Families`, `Girl Child`
- **Level Badge** — Central Government (blue) or State Government (green)
- **Available States** — if restricted to specific states
- **"Apply Now" Button** — opens the official government portal in a new tab
- **"Details" Button** — opens a modal with full eligibility rules

**Tabs:**
- **Eligible for You** — schemes matched to your profile
- **All Schemes** — full database of schemes (searchable)

**Documents Checklist Sidebar:**
Always visible — lists common documents needed across most schemes:
- Aadhaar Card
- PAN Card
- Bank Account Details
- Income Certificate
- Residence Proof
- Passport Size Photos

**Helpline Numbers Sidebar:**
- National Helpline: 1800-11-6263
- Women Helpline: 181
- Child Development: 1098

### Real-Life Example
> *Sunita is a 24-year-old pregnant woman from Rajasthan with a low family income. After filling her profile, EmpowerHer's Eligible Schemes tab shows her "Pradhan Mantri Matru Vandana Yojana (PMMVY)" with a benefit of ₹5,000 and the "Janani Suraksha Yojana (JSY)" offering financial assistance for institutional delivery. She taps "Apply Now" and is taken directly to the official registration portal.*

---

## 7. AI Health Assistant (Chat)

### What it does
A full conversational AI chat interface powered by large language models (via OpenRouter) that acts as a compassionate, knowledgeable women's health companion. It answers health questions, provides advice grounded in Indian dietary and cultural context, and maintains conversation history for contextual responses.

### How it works — Step by Step

**Conversation Flow:**
1. The chat interface opens with 8 suggested questions displayed as quick-tap buttons:
   - "What should I eat during my period?"
   - "How can I manage PMS symptoms?"
   - "Is it normal to have irregular periods?"
   - "What exercises are good during pregnancy?"
   - "How can I improve my mood naturally?"
   - "What are the symptoms of PCOD?"
   - "How much water should I drink daily?"
   - "What are the benefits of yoga for women?"
2. User types a question or taps a suggestion.
3. The last 5 messages are sent as conversation history along with the new message to the backend (`POST /api/ai/chat/`).
4. The backend constructs a detailed system prompt:
   > *"You are EmpowerHer, a compassionate AI women's health assistant. Give accurate, warm, evidence-based advice. Never diagnose. Understand Indian health context: PCOD, ayurvedic remedies, Indian diet."*
5. The message is sent to OpenRouter with a 3-model fallback chain to ensure reliability even during rate limits.
6. The AI response is displayed in a styled chat bubble.

**Model Fallback System:**
OpenRouter is configured with up to 3 fallback models. If the primary model is rate-limited (429 error) or unavailable, the next model in the chain is automatically tried.

**Language Support:**
If the user's app language is set to Hindi, Kannada, Tamil, or Telugu, the system prompt instructs the AI to respond in that language.

**UI Details:**
- User messages appear on the right in rose-colored bubbles.
- AI responses appear on the left in grey bubbles.
- A three-dot typing animation appears while the AI is responding.
- Press `Enter` to send; `Shift+Enter` for a new line.
- A disclaimer reminds users this is not a substitute for professional medical advice.

### Real-Life Example
> *Deepa has been experiencing irregular periods for 3 months. She types: "I'm 22 years old and my periods have been irregular for 3 months. Could this be PCOD?" EmpowerHer responds: "Irregular periods for 3+ months can be a sign of PCOD (Polycystic Ovarian Disease), though they can also be caused by stress, weight changes, or thyroid issues. Common PCOD symptoms include weight gain around the abdomen, excess hair growth, acne, and difficulty losing weight. I'd strongly recommend seeing a gynaecologist for an ultrasound and hormone panel. In the meantime, maintaining a balanced diet low in refined sugars and getting regular exercise can help regulate hormones."*

---

## 8. Health Report Generator

### What it does
Generates a comprehensive, professionally formatted PDF health report for the user — summarising their cycle history, mood patterns, nutrition data, and eligible government schemes into a single document that they can download and share with their doctor.

### How it works — Step by Step

**Generating a Report:**
1. User navigates to the Health Reports page and clicks "Generate Report."
2. The backend creates a `HealthReport` record with status `pending` and immediately queues it for background processing via Celery (a task queue).
3. The frontend polls the report status and shows a loading indicator.
4. In the background, the Celery worker:
   - Fetches all the user's cycle logs, mood logs, meal logs, and profile data
   - Renders a pre-built Django HTML template (`reports/monthly_report.html`) with this data
   - Converts the rendered HTML to a PDF using **WeasyPrint** (a full CSS-capable HTML-to-PDF library)
   - Saves the PDF to `media/reports/report_{id}.pdf`
   - Updates the report record's status to `ready`
5. The frontend detects the status change and shows a "Download PDF" button.

**What's in the Report:**
- User name, age, profile details
- Recent cycle history (last 3–6 cycles with dates, flow, cramp scores)
- Monthly mood summary and average score
- Weekly nutrition data (calorie and macro averages)
- List of eligible government schemes
- Report generation date

**One Report Per Day:**
The system enforces one report per calendar day. If a report already exists for today, clicking "Generate" returns the existing one instead of creating a duplicate.

**Failure Recovery:**
If a report fails (e.g., WeasyPrint error), its status is set to `failed`. The user can retry — the backend resets the status to `pending` and re-queues the generation task.

### Real-Life Example
> *Preethi has a gynaecologist appointment on Friday. On Thursday, she opens EmpowerHer and clicks "Generate Report." Within 30 seconds, her PDF is ready. She downloads it and brings it to the appointment. The doctor can now see her last 4 cycle lengths, that her cramp score has been consistently high (7–9/10), and that her mood dips before each period — helping the doctor quickly diagnose potential endometriosis.*

---

## 9. Dashboard — Health Overview

### What it does
A personalised, at-a-glance overview of the user's current health status across all tracked areas — shown as summary cards and quick action shortcuts.

### What you see

**4 Summary Cards:**
| Card | What it shows | Example |
|---|---|---|
| 🌸 Next Period | Days until next predicted period | "In 12 days" |
| 🧠 How Feeling | Today's logged mood score | "7/10" |
| 🥗 Today's Calories | Total calories logged today | "1,340 kcal" |
| 🛡️ Eligible Schemes | Count of matching schemes | "5 schemes" |

**Quick Actions Grid:**
4 shortcut buttons for the most common actions:
- 📅 Log Period → navigates to Cycle Tracker
- 🧠 Log Mood → navigates to Mental Wellness
- 🍽️ Log Meal → navigates to Fitness & Nutrition
- 💬 AI Chat → navigates to AI Health Assistant

**Recent Cycle History:**
Shows the user's most recent period log (start date, flow level, cramp score) with a link to view full history.

**Profile Completion Prompt:**
If the user hasn't completed onboarding (missing age or state), a card prompts them to complete their profile with a "Complete Profile" button.

**Greeting:**
- "Good Morning, Priya" — changes based on time of day (Morning / Afternoon / Evening)
- Shows today's date in the user's chosen language format

### Real-Life Example
> *Ananya opens the app at 8 AM. She sees "Good Morning, Ananya" and notices she has 5 days until her next period. Her mood card shows "Not logged" — she quickly taps "Log Mood." Her calorie card shows 0 kcal — she navigates to the food logger to log her breakfast. The profile card reminds her she hasn't entered her state yet, which she does to unlock scheme recommendations.*

---

## 10. Multi-Language Support

### What it does
The entire application is fully internationalised and can be used in **5 languages**, making it accessible to women across different regions of India who may not be fluent in English.

### Supported Languages

| Code | Language | Target Region |
|------|----------|---------------|
| `en` | English | Pan-India |
| `hi` | Hindi | North India |
| `kn` | Kannada | Karnataka |
| `ta` | Tamil | Tamil Nadu |
| `te` | Telugu | Andhra Pradesh / Telangana |

### How it works
- The `react-i18next` library manages all UI text. Every label, button, heading, and message is stored in translation JSON files under `frontend/public/locales/{lang}/translation.json`.
- When the user selects a language in their profile, `i18next` switches the entire UI instantly without a page reload.
- The AI Chat's `language` parameter is also sent to the backend, which instructs the AI model to respond in the chosen language.
- Dates are formatted using the browser's `toLocaleDateString()` with the active language code as the locale.

### Real-Life Example
> *Lakshmi lives in a rural area of Karnataka and is not comfortable reading English. She switches the app to Kannada from the profile page. All menus, buttons, and form labels instantly appear in Kannada. When she asks the AI chat a question about pregnancy nutrition, the AI responds in Kannada as well.*

---

## 11. Progressive Web App (PWA)

### What it does
EmpowerHer can be **installed** on any Android or iOS device like a native app — appearing on the home screen with an icon, loading in full-screen mode (no browser address bar), and supporting basic offline functionality.

### How it works

**Installation:**
When accessed from a mobile browser (Chrome, Safari), the browser automatically shows an "Add to Home Screen" banner. After installation, the app icon appears alongside native apps.

**Service Worker:**
- In **Production**: A Service Worker (`/public/sw.js`) caches the app shell (HTML, CSS, JavaScript) for offline use. This means the UI loads even without an internet connection.
- In **Development**: The Service Worker is automatically disabled so that Vite's Hot Module Replacement (HMR) works correctly without stale cache interference.

**Push Notifications:**
The Service Worker is configured to receive push notifications — for future features like period reminders ("Your period is due in 2 days!") or medication reminders.

**Background Sync:**
The `sync` event is registered for syncing data that was logged while offline, once connectivity is restored.

### Real-Life Example
> *Sunita lives in a village with poor internet connectivity. She installs EmpowerHer on her phone during a moment of good signal. Later, when she has no data, she opens the app and the dashboard still loads from cache. When connectivity returns, her mood and cycle logs from offline automatically sync to the server.*

---

## 12. Security & Authentication

### What it does
EmpowerHer uses industry-standard JWT (JSON Web Token) authentication to securely identify users across all API calls, with intelligent handling of expired tokens and protection against common web vulnerabilities.

### How it works

**Login Flow:**
1. User submits username and password.
2. The backend (`/api/auth/login/`) authenticates using Django's built-in `authenticate()` function.
3. If valid, two tokens are generated using `djangorestframework-simplejwt`:
   - **Access Token** — short-lived (60 minutes), used in every API request header as `Authorization: Bearer <token>`
   - **Refresh Token** — long-lived (7 days), stored securely for token renewal
4. Tokens are stored in the browser's `localStorage` via Zustand's persist middleware.

**Every API Call:**
An Axios request interceptor automatically reads the token from storage and attaches it to every outgoing request header before it is sent to the backend.

**Token Expiry Handling:**
An Axios response interceptor monitors all API responses. If a `401 Unauthorized` response is received:
1. The invalid token is immediately erased from `localStorage` (`localStorage.removeItem('empowerher-auth')`)
2. The user is redirected to `/login`
This prevents the infinite redirect loop that would occur if an expired/invalid token was kept in storage.

**Password Security:**
- Passwords are hashed using PBKDF2 with a SHA-256 hash, salted with a random value — Django's default and industry-recommended approach.
- 4 password validation rules are enforced: Similarity check, Minimum length, Common password blacklist, Numeric-only check.

**CORS Protection:**
Django's `django-cors-headers` middleware is configured to control which origins can make API requests.

**Input Validation:**
All data submitted through forms is validated on both the frontend (HTML5 constraints + JavaScript) and the backend (Django REST Framework serializers) before being saved to the database.

### Real-Life Example
> *Priya logs in on her phone and closes the app. 30 days later, her access token has expired. When she opens the app and the dashboard tries to load data, the backend returns 401. The Axios interceptor catches this, clears her stale token from storage, and redirects her smoothly to the login page — rather than showing a broken screen with endless loading spinners.*

---

## Architecture Overview

```
User (Browser/PWA)
       │
       │  HTTP/S
       ▼
  React Frontend (Vite)     ─── Port 3001
       │
       │  API Proxy /api/* → :8000
       ▼
  Django REST Framework      ─── Port 8000
       │
       ├── Auth (JWT)
       ├── Cycle API
       ├── Fitness API
       ├── Mental API
       ├── Pregnancy API
       ├── Schemes API
       ├── Reports API
       └── AI Service API
              │
              │ HTTP to OpenRouter
              ▼
       OpenRouter.ai (AI Models)
              │
              └── Multi-model fallback
                  [Model 1] → [Model 2] → [Model 3]

  Background Tasks (Celery)  ←── Redis (Message Broker)
       │
       └── PDF Report Generation (WeasyPrint)
              └── Saved to media/reports/
```

---

## Quick Reference — All API Endpoints

| Feature | Method | Endpoint |
|---------|--------|----------|
| Register | POST | `/api/auth/register/` |
| Login | POST | `/api/auth/login/` |
| Refresh Token | POST | `/api/auth/token/refresh/` |
| Get Profile | GET | `/api/auth/profile/` |
| Update Profile | PATCH | `/api/auth/profile/update/` |
| Dashboard Data | GET | `/api/auth/dashboard/` |
| List Cycles | GET | `/api/cycles/` |
| Log Period | POST | `/api/cycles/` |
| Cycle Prediction | GET | `/api/cycles/prediction/` |
| List Meals | GET | `/api/fitness/meals/` |
| Log Meal | POST | `/api/fitness/meals/` |
| Analyze Food Photo | POST | `/api/fitness/meals/analyse-photo/` |
| Nutrition Summary | GET | `/api/fitness/summary/` |
| List Moods | GET | `/api/mental/mood/` |
| Log Mood | POST | `/api/mental/mood/` |
| AI Mood Analysis | GET | `/api/mental/patterns/` |
| Get Pregnancy Profile | GET | `/api/pregnancy/` |
| Create Pregnancy Profile | POST | `/api/pregnancy/` |
| Weekly Development | GET | `/api/pregnancy/weekly/` |
| Analyze Symptoms | POST | `/api/pregnancy/symptoms/` |
| Eligible Schemes | GET | `/api/schemes/eligible/` |
| All Schemes | GET | `/api/schemes/all/` |
| List Reports | GET | `/api/reports/` |
| Generate Report | POST | `/api/reports/generate/` |
| Download Report | GET | `/api/reports/<id>/download/` |
| AI Chat | POST | `/api/ai/chat/` |

---

*EmpowerHer — Your Health. Your Story.* 🌸
