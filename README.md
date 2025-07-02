# DevPro

A full-stack web application built with the MERN stack that allows users to:

- Browse and contribute to community campaigns  
- Make payments  
- Manage user profiles  
- Authenticate via login/register  

## 🔧 Tech Stack

- **Frontend:** React, Vite, React Router  
- **Backend:** Node.js, Express, Sequelize  
- **Database:** MySQL  
- **Authentication:** JWT + Cookies  

## 📦 Features

- Login/Register (JWT + Cookie-based)  
- Campaign listing and details  
- Payment logic  
- Edit user profile (username, password, profile image)  
- Protected routes using React Context  
- Role-based navigation (LogOut shown only when logged in)  

## 🚀 Getting Started

### 📥 Clone the Repository and Install Dependencies

```bash
# 1. Clone the repository
git clone https://github.com/devpro-rif/DevPro.git
cd DevPro

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install

# ✅ Done installing dependencies.
# ❗ Now close this terminal and reopen a new one to start the app properly.
