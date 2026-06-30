# Authentication Project

This project is a full-stack authentication and user management application built with React (frontend) and Express + MongoDB (backend). It supports user registration, email OTP verification, login, password recovery, profile management, role-based access for users and admins, and real-time notifications.

## Project Overview

The application is divided into two major parts:

- Frontend: A React + Vite application that provides the UI for login, registration, profile management, admin dashboard, and password recovery.
- Backend: An Express.js API that handles authentication, JWT-based sessions, MongoDB persistence, OTP email verification, and notification logic.

The system is designed to provide a secure authentication experience with:

- Email-based OTP verification during signup
- Login and logout with token-based session handling
- Password reset through email OTP
- Profile update and password change
- Role-based routing for admin and regular users
- Real-time notifications using Socket.IO

## Why This Project Is Important

This project is important because it demonstrates a complete, real-world authentication system that can be used as a foundation for modern web applications. It shows how a frontend and backend can work together securely to handle user registration, protected routes, profile management, and admin access.

It is useful for learning:

- Full-stack web application architecture
- Secure authentication and session management
- Role-based access control
- API integration between frontend and backend
- Database-driven user management

## How the Frontend and Backend Work Together

- The frontend provides the user interface for login, registration, profile pages, and admin pages.
- The backend exposes REST APIs for authentication and user management.
- When a user logs in, the frontend sends credentials to the backend, which validates them and returns a session token.
- The frontend uses that session to protect pages and call authenticated APIs.
- The backend stores user data in MongoDB and handles email OTP verification, password reset, and notifications.

---

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email sending
- Socket.IO for notifications
- Cookie parser and CORS

---

## Folder Structure

```text
Authentication/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── sockets/
│   │   ├── templates/
│   │   ├── utils/
│   │   ├── config/
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ToastProvider.jsx
│   │   │   └── admin/Navbaradmin.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Forgot-password.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── admin/Dashboard.jsx
│   │   ├── routes/
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── LoginRoute.jsx
│   │   │   └── UserRoute.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── toast.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
└── README.md
```

### Frontend File Descriptions

- src/main.jsx: The main entry point of the React application. It renders the app into the browser and mounts the root component.
- src/App.jsx: Defines the application routes and navigation flow. It handles public, user, and admin routes using React Router.
- src/components/: Contains reusable UI components such as the navbar, toast provider, and admin navbar.
- src/context/: Stores React context providers for authentication and theme state.
- src/pages/: Contains the main page views for login, registration, forgot password, home, profile, and admin dashboard/settings.
- src/routes/: Contains route protection components that restrict access based on the user's authentication state and role.
- src/services/api.js: Configures Axios and manages API requests to the backend, including token refresh handling.
- src/utils/toast.js: Contains helper functions for showing success and error notifications.
- src/index.css: Global styles and Tailwind-based styling setup.

---

## How the Project Works

### 1. User Registration Flow
1. A new user enters full name, email, phone, and password.
2. The backend sends an OTP to the provided email.
3. The user verifies the OTP.
4. After successful verification, the account is created in MongoDB.

### 2. Login Flow
1. The user sends login credentials to the backend.
2. The backend verifies the email and password.
3. If valid, it creates an access token and refresh token/session.
4. The frontend stores the user session and redirects depending on role.

### 3. Profile and Security Features
- Users can view and update their profile information.
- Users can change their password.
- Users can reset forgotten passwords using an OTP-based flow.
- Admins get access to protected admin routes.

### 4. Notifications
- The backend uses Socket.IO to send notifications to users.
- Notification events are triggered during account-related actions.

---

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (recommended version 18 or above)
- npm or yarn
- MongoDB running locally or a MongoDB Atlas connection string
- A valid email account for sending OTP emails

---

## Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Create environment file
Create a file named `.env` inside the backend folder and add the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/authentication
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
JWT_SECRET=your_super_secret_key
ACCESS_EXPIRES_IN=15m
REFRESH_EXPIRES_IN=7d
ADMIN_CLIENT_URL=http://localhost:5173
USER_CLIENT_URL=http://localhost:5173
```

### 3. Run the backend

Development mode:

```bash
npm run dev
```

Or production mode:

```bash
npm start
```

The backend server should start on the port defined in `PORT`.

### 4. Seed an admin account (optional)

```bash
npm run seed:admin
```

This creates a default admin account in the database.

Example admin credentials:
- Email: admin123@gmail.com
- Password: Admin@123

---

## Frontend Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Create environment file
Create a file named `.env` inside the frontend folder:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Run the frontend

```bash
npm run dev
```

The frontend will usually open at:

```text
http://localhost:5173
```

---

## Default Application Flow

1. Open the frontend in the browser.
2. Register a new account or log in.
3. Complete OTP verification if registering.
4. Access your profile and account settings.
5. Admin users can access the admin dashboard and settings pages.

---

## Important Notes

- The backend requires a working MongoDB connection.
- Email OTP sending requires a real email account and app password configuration.
- The frontend depends on the backend running at the API base URL configured in `VITE_API_BASE_URL`.
- If you change the backend port, make sure the frontend environment variable matches it.

---

## Common Issues

### MongoDB connection error
- Make sure MongoDB is installed and running.
- Verify that `MONGODB_URI` is correct.

### Email not sending
- Check that `EMAIL_USER` and `EMAIL_PASS` are valid.
- If using Gmail, enable an app password instead of the normal password.

### Frontend cannot connect to backend
- Confirm the backend is running.
- Verify `VITE_API_BASE_URL` points to the correct backend URL.

---

## Summary

This project is a complete authentication system with:

- Secure registration and login
- OTP verification
- JWT sessions
- Profile management
- Password reset and change password
- Admin user support
- Real-time notifications

It is a solid base for building a larger full-stack application with user authentication and role-based access.
