# FitTrack 🏋️‍♂️🤖

**FitTrack** is an AI-powered web application that acts as your virtual personal trainer. Designed with a mobile-first, responsive interface, it allows users to track workouts, set fitness goals, and receive personalized recommendations powered by OpenAI's language model. FitTrack is ideal for anyone starting or continuing a fitness journey and seeking consistent, intelligent guidance.

---

## 🚀 Features

- 🔐 Secure user registration and login
- 🗓️ Activity and progress tracking
- 📊 Goal-setting and measurement logging
- 💬 AI chatbot for personalized fitness coaching (OpenAI API)
- 📱 Mobile-first, responsive UI built with React + TypeScript
- 🔄 RESTful API backend with .NET
- 🧠 AI recommendations adapt to user’s fitness data
- 🗄️ PhpMyAdmin (MySQL) for structured database management

---

## 📐 Tech Stack

- **Frontend:** React + TypeScript (mobile-first responsive design)
- **Backend:** .NET REST API
- **Database:** PhpMyAdmin (MySQL)
- **AI Integration:** OpenAI GPT API
- **Authentication:** Secure session-based or token-based login
- **Styling:** CSS3 + custom media queries

---

## 📷 Screenshots

![User Home Page Desktop](https://github.com/user-attachments/assets/b0d615cf-7c7b-4119-86a9-a3fed4caeace)

![Chatbot page desktop](https://github.com/user-attachments/assets/4e363e3b-125e-4cd3-8d62-5ec33d0b0dde)

![Physical Metrics page](https://github.com/user-attachments/assets/f8fc78b7-fb9f-4338-a013-32b4846e2e10)

![Fitness goals page desktop](https://github.com/user-attachments/assets/db810680-accf-4756-ac87-b097f2fca976)

![Progress measurement history](https://github.com/user-attachments/assets/38816fba-e30a-4cf3-b239-37f3fc54727e)

![Set goal page](https://github.com/user-attachments/assets/5d59038a-b226-410a-af34-8cfeb1549708)


## 🔧 Installation & Run Instructions

```bash
# Clone the repository
git clone https://github.com/your-username/fittrack.git

# Frontend Setup
cd ./FitTrack-Front
npm install
npm start

# Backend Setup
cd ./FitTrack-Back
dotnet restore
dotnet run

# Database
# Import the SQL schema via PhpMyAdmin or connect to a MySQL server

