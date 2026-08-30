# 🏠 RoomNest — Hyperlocal Student & Professional Rental Housing Platform

> An intelligent, map-centric hyperlocal accommodation discovery and rental platform designed for students and working professionals near educational and tech hubs.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v8-purple.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Key Highlights & Features

- 🗺️ **Interactive Geographic Map**: Real-time Leaflet radius radar showing walking distance to universities and major colleges.
- ⚡ **Hyperlocal Distance & Cost Breakdown**: Exact breakdown of rent, deposit, maintenance, electricity tariffs, food options, and lock-in periods.
- 🛡️ **Verified Properties & Safety Rating**: Verification badges, student/tenant reviews, owner verification, and curfew/policy filters.
- 🔄 **Side-by-Side Property Comparison**: Instant comparative analysis of amenities, deposits, distances, and monthly costs.
- 🔒 **Enterprise-Grade REST API**: Documented with Swagger UI (`/api/docs`), JWT Authentication, Rate Limiting, Mongo Sanitization, and Helmet Security.
- 🌐 **Multilingual Support**: English, Hindi, and Odia local language support.

---

## 🏗️ Architecture & Tech Stack

```
roomnest/
├── client/                 # React 19 + Vite Frontend SPA
│   ├── src/
│   │   ├── components/     # UI, Maps, Modals, Listings, Dashboard
│   │   ├── context/        # App State & Internationalization
│   │   └── utils/          # Formatting & Helpers
│   └── vercel.json         # Vercel Deployment Configuration
│
└── server/                 # Node.js + Express REST API
    ├── data/               # Seed scripts with verified real-world listings
    ├── src/
    │   ├── config/         # MongoDB connection & Cloudinary setup
    │   ├── controllers/    # API endpoint controllers
    │   ├── docs/           # Swagger / OpenAPI 3.0 documentation
    │   ├── middleware/     # Auth, Roles, Error & Rate Limiters
    │   ├── models/         # Mongoose Schemas (Property, User, Visit, Review)
    │   ├── routes/         # Modular REST Routes
    │   └── services/       # Business logic layers
    └── server.js           # Server entrypoint
```

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (Local or MongoDB Atlas)

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env     # Configure your MONGO_URI and JWT_SECRET
npm run seed             # Seed sample verified listings
npm run dev              # Starts API on http://localhost:5000
```
API Documentation will be live at: `http://localhost:5000/api/docs`

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev              # Starts frontend on http://localhost:5173
```

---

## ☁️ Deployment Guide

### Backend on Render / Railway
1. Set Root Directory to `server`.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Set Environment Variables:
   - `NODE_ENV=production`
   - `MONGO_URI=<your-atlas-connection-string>`
   - `JWT_SECRET=<your-secret>`
   - `CLIENT_URL=https://<your-vercel-app>.vercel.app`

### Frontend on Vercel
1. Set Root Directory to `client`.
2. Framework: `Vite`.
3. Output Directory: `dist`.
4. Set Environment Variable:
   - `VITE_API_URL=https://<your-render-app>.onrender.com/api`

---

## 📄 License
This project is licensed under the MIT License.
