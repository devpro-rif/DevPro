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

### 📥 Clone the Repository 

```bash
# 1. Clone the repository
git clone https://github.com/devpro-rif/DevPro.git
cd DevPro
```
### 📥 Install Dependencies
```bash
# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install
```

## 🔐 Environment Variables

### 📁 server/.env
- PORT=4000
- DB_NAME=devpro
- DB_USER=root
- DB_PASSWORD=
- DB_HOST=localhost
- DB_DIALECT=mysql
- JWT_SECRET= secretKey
- STRIPE_SECRET_KEY = sk_test_51RfSyjQGBgXHeRkdfwPc2UH8FPYwfHSRD1Yv9vTFR4wgIiecwYfTACgmdt61APiDyaKkWyTTUpTAfSjNyMxkSl4100qW7xMPbN


### 📁 client/.env
- VITE_API_URL=http://localhost:4000/api
- VITE_STRIPE_PUBLISHABLE_KEY = pk_test_51RfSyjQGBgXHeRkd9x4T5VH1DRLaeCk2sUXXV5mJBtC7nyqrmnejV24WhJUaT3vSrRGBn2Pm3pwpTbWoSDLyit8h008djV5HOQ


