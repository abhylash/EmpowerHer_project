# EmpowerHer — Phase 3 Project Review Report 🌸

## 1. Project Vision
**EmpowerHer** is a specialized health and wellness platform designed for the Indian context. We use AI to solve real health problems faced by women—from menstrual health and pregnancy to nutrition and government welfare access. This report outlines the technical achievements and real-world benefits of the platform as of Phase 3.

---

## 2. Core Features & Technical Implementation

### 📅 Menstrual Cycle Tracker & Prediction
*   **How it works:** Users log their period dates, flow level (Light/Medium/Heavy), and cramp intensity. The backend calculates the **Average Cycle Length** and uses it to predict:
    *   Next Period Date
    *   Ovulation Window (Fertility Window)
    *   Current Cycle Phase (Menstrual, Follicular, Ovulatory, or Luteal)
*   **Benefit:** Helps women manage their lifestyle and diet according to their cycle phase. For example, the app suggests different types of self-care during the Luteal phase (pre-period).
*   **Real-Life Example:** *Sneha logs her dates. The app predicts her next period on June 10th. She can now plan her office presentation and travel more confidently.*

### 🍽️ AI-Powered Food Detection & Nutrition
*   **How it works:** Users can search for Indian foods or **upload a photo** of their meal. We use **AI Vision (Gemma/Llama via OpenRouter)** to identify dishes like *Dal, Roti, Sambar* and return a precise JSON summary of Calories, Protein, Carbs, and Fat.
*   **Benefit:** Traditional calorie counting is boring and hard. Taking a photo is fast. This helps women maintain healthy macros, which is crucial for conditions like PCOD.
*   **Real-Life Example:** *A user takes a photo of her breakfast. The AI identifies '2 Idlis and Chutney' and automatically logs 180 calories. No manual typing needed.*

### 👶 Smart Pregnancy Tracker
*   **How it works:** Tracks development from the Last Menstrual Period (LMP). It calculates the **Estimated Due Date (EDD)** and shows week-by-week baby growth using familiar fruit/vegetable comparisons (e.g., Week 8 = Blueberry).
*   **Benefit:** Reduces anxiety by explaining what is happening inside the body. The **Symptom Danger Checker** flags high-risk symptoms (like blurred vision or fever) and instructs the user to see a doctor immediately.
*   **Real-Life Example:** *Meera is at Week 30. The app tells her the baby is practicing breathing and reminds her to pack her hospital bag.*

### 🧠 Mental Wellness & Mood Journal
*   **How it works:** Users log mood scores (1–10). A **Z-Score Trend Analysis** in the frontend shows mood patterns. The AI analyzes these logs to identify emotional patterns or PMS-related dips.
*   **Benefit:** Helps women understand the connection between their hormones and their mental health.
*   **Real-Life Example:** *The AI identifies that the user's mood dips exactly 3 days before her period, validating that she is experiencing PMS and suggesting light yoga.*

### 🏛️ Government Schemes Matchmaking
*   **How it works:** A JSON-based eligibility engine matches the user's profile (Age, State, Income, Pregnancy status) with Central and State schemes like **PMMVY** or **Janani Suraksha Yojana**.
*   **Benefit:** Most women don't know about the money and health benefits they are entitled to. This feature brings those benefits to their fingertips.
*   **Real-Life Example:** *A pregnant user from Karnataka sees a list of 4 schemes she is eligible for, with direct links to apply on official portals.*

### 💬 AI Health Assistant (Chatbot)
*   **How it works:** A 24/7 assistant powered by **Large Language Models**. It has a custom "System Prompt" to act as a compassionate Indian dietitian and health coach. It supports **Hindi, Kannada, Tamil, and Telugu**.
*   **Benefit:** Provides instant answers to health queries without the "fear-mongering" often found in Google searches.
*   **Real-Life Example:** *Lakshmi asks in Kannada about iron-rich foods, and the bot suggests Ragi and Green Leafy Vegetables common in her region.*

### 📄 Comprehensive Health Reports (PDF)
*   **How it works:** Uses **Celery (background task queue)** and **WeasyPrint** to generate a professional PDF report. It gathers data from all modules (cycles, mood, food) into one document.
*   **Benefit:** Users can download this and show it to their doctor. It gives the doctor a perfect "history" of the patient's health for the past month.

---

## 3. Technical Robustness & Security
1.  **AI Fallback System**: We use a chain of models on OpenRouter. If one model (like Gemini) is down, the system automatically switches to Llama-3 or Gemma to ensure the app never fails.
2.  **JWT Authentication**: Secure login with token-refresh logic. If a session expires, the "Axios Interceptor" smoothly redirects the user to login, preventing crashes.
3.  **PWA Integration**: The app can be "installed" on Android/iOS home screens. It uses a **Service Worker** to cache the app, so it loads even in low-network rural areas.
4.  **Responsive Design**: Built using React and Tailwind CSS, making it look beautiful and premium on both tiny phones and large tablets.

---

## 4. Future Enhancements (Phase 4 Roadmap)
1.  **Doctor Appointment System**: Integrating a booking module to connect users with nearby gynaecologists.
2.  **Community Hub**: A safe, anonymous space for women to discuss health topics and support each other.
3.  **Wearable Sync**: Connecting with smartwatches to pull heart rate and sleep data into the dashboard.
4.  **Period Product Tracker**: Reminders for when to restock or change sanitary products.

---

## 5. Conclusion
**EmpowerHer** is not just an app; it is an AI companion for the modern Indian woman. By combining data science with a deep understanding of Indian health needs, we have created a platform that is ready for real-world impact.

---
*End of Report — EmpowerHer Development Team*
