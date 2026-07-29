<div align="center">

#  LeadDesk Mini

### Modern Full-Stack Lead Management System

A production-ready Lead Management application built using **React, Express, MongoDB, and JWT Authentication**.

<p>

<a href="https://lead-desk-mini-p078.vercel.app">
<img src="https://img.shields.io/badge/🌐_Live_Demo-Visit-success?style=for-the-badge"/>
</a>

<a href="https://lead-desk-mini-p078.vercel.app/admin">
<img src="https://img.shields.io/badge/🔐_Admin-Portal-blue?style=for-the-badge"/>
</a>

<a href="https://github.com/priyamvada7078/LeadDesk-Mini">
<img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github"/>
</a>

</p>

<p>

<img src="https://img.shields.io/github/stars/priyamvada7078/LeadDesk-Mini?style=social"/>
<img src="https://img.shields.io/github/last-commit/priyamvada7078/LeadDesk-Mini"/>
<img src="https://img.shields.io/github/license/priyamvada7078/LeadDesk-Mini"/>

</p>

</div>

---

# 📖 Overview

LeadDesk Mini is a modern, responsive and production-ready Lead Management System that allows visitors to submit enquiries through a public landing page while enabling administrators to securely manage leads through an authenticated dashboard.

The project demonstrates complete end-to-end full-stack development including frontend development, REST APIs, authentication, database design, deployment, validation, and production configuration.

---

# ✨ Features

## 🌐 Public Portal

- Responsive Landing Page
- Lead Capture Form
- Client-side Validation
- Server-side Validation
- Budget Range Selection
- Success & Error Notifications
- Dark / Light Theme

---

## 🔐 Admin Portal

- Secure JWT Authentication
- Protected Routes
- Admin Login
- View All Leads
- Search Leads
- Update Lead Status
- Logout Functionality

Lead Statuses

- 🟢 New
- 🟡 Contacted
- 🔵 Closed

---

# 🛠 Tech Stack

## Frontend

<p>
<img src="https://skillicons.dev/icons?i=react,vite,tailwind,js,html,css" />
</p>

- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM

---

## Backend

<p>
<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" />
</p>

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt
- Express Validator
- Helmet
- CORS

---

## Tools

<p>
<img src="https://skillicons.dev/icons?i=git,github,vscode" />
</p>

- Thunder Client
- Render
- Vercel

---

# 🏗 System Architecture

```text
                User
                  │
                  ▼
      React Frontend (Vercel)
                  │
         Axios HTTP Requests
                  │
                  ▼
      Express REST API (Render)
                  │
                  ▼
      JWT Authentication Layer
                  │
                  ▼
         MongoDB Atlas Database
```

---

# 📂 Project Structure

```text
LeadDesk-Mini
│
├── backend
│   ├── scripts
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   └── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   └── package.json
│
├── screenshots
│
└── README.md
```

---

# 🗄 Database Schema

## Admin

| Field | Type |
|---------|------|
| Email | String |
| Password | Hashed String |
| Created At | Date |
| Updated At | Date |

---

## Lead

| Field | Type |
|---------|------|
| Name | String |
| Email | String |
| Budget | String |
| Message | String |
| Status | String |
| Created At | Date |
| Updated At | Date |

---

# 🔐 Authentication Flow

```text
Admin Login
      │
      ▼
Email + Password
      │
      ▼
Express API
      │
      ▼
bcrypt Password Verification
      │
      ▼
JWT Generated
      │
      ▼
Stored on Client
      │
      ▼
Protected Routes
```

---

# 🌐 API Endpoints

## Authentication

| Method | Endpoint |
|----------|--------------------|
| POST | /api/auth/login |

---

## Leads

| Method | Endpoint |
|----------|----------------|
| POST | /api/leads |
| GET | /api/leads |
| PATCH | /api/leads/:id |
| DELETE | /api/leads/:id |

---

# 📸 Application Preview

## 🏠 Landing Page

<p align="center">
<img src="./screenshots/landing-page.png" width="900"/>
</p>

---

## ✍️ Lead Form

<p align="center">
<img src="./screenshots/lead-form.png" width="900"/>
</p>

---

## 🔐 Admin Login

<p align="center">
<img src="./screenshots/admin-login.png" width="900"/>
</p>

---

## 📊 Admin Dashboard

<p align="center">
<img src="./screenshots/admin-dashboard.png" width="900"/>
</p>

---

## 🌙 Dark Mode

<p align="center">
<img src="./screenshots/dark-mode.png" width="900"/>
</p>

---

## 📱 Mobile Responsive

<p align="center">
<img src="./screenshots/mobile-view.png" width="350"/>
</p>

---

# 🚀 Local Setup

## Clone Repository

```bash
git clone https://github.com/priyamvada7078/LeadDesk-Mini.git

cd LeadDesk-Mini
```

---

## Backend

```bash
cd backend

npm install
```

Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Start backend

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend

npm install
```

Create a `.env` file

```env
VITE_API_URL=http://localhost:5000
```

Run frontend

```bash
npm run dev
```

---

# ☁️ Deployment

| Service | Platform |
|-----------|-----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

# 🧪 Test Credentials

| Field | Value |
|--------|--------|
| Email | admin@leaddesk.com |
| Password | Admin@123 |

---

# 🚀 Future Enhancements

- Dashboard Analytics
- Pagination
- CSV Export
- Email Notifications
- Multiple Admin Roles
- Forgot Password
- Refresh Tokens
- Lead Notes
- Sorting & Filtering
- File Attachments

---

# 👩‍💻 Author

**Priyamvada Chaudhary**

🎓 B.Tech Information Technology

**GitHub**

https://github.com/priyamvada7078

**LinkedIn**

https://www.linkedin.com/in/priyamvada7078

---

# ❤️ Acknowledgements

This project was developed as part of the **Digital Heroes Internship Qualification Task**.

**Built for Digital Heroes Training Task**

https://digitalheroesco.com

---

<div align="center">

⭐ If you found this project helpful, consider giving it a star!

Made with ❤️ using React, Express, MongoDB & JWT Authentication.

</div>
