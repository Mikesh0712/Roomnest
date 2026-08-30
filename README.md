# 🏠 RoomNest — Hyperlocal Student & Professional Rental Housing Platform

> An intelligent, map-centric hyperlocal accommodation discovery and rental platform designed for students and working professionals near educational and tech hubs.

[![Live Website](https://img.shields.io/badge/🌐_Live_Demo-roomnest.vercel.app-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://roomnest.vercel.app/)
[![API Status](https://img.shields.io/badge/🚀_API_Docs-Swagger_UI-46E3B7?style=for-the-badge&logo=swagger&logoColor=black)](https://roomnest-m8uu.onrender.com/api/docs)
[![GitHub](https://img.shields.io/badge/GitHub-Mikesh0712%2FRoomnest-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Mikesh0712/Roomnest)

---

## 🔗 Live Deployments & Showcase Links

- **🌐 Live Web Application:** [https://roomnest.vercel.app](https://roomnest.vercel.app)
- **⚡ Production REST API:** [https://roomnest-m8uu.onrender.com/api/health](https://roomnest-m8uu.onrender.com/api/health)
- **📖 Interactive API Documentation (Swagger UI):** [https://roomnest-m8uu.onrender.com/api/docs](https://roomnest-m8uu.onrender.com/api/docs)

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
├── client/                 # React 19 + Vite Frontend SPA (Hosted on Vercel)
│   ├── src/
│   │   ├── components/     # UI, Maps, Modals, Listings, Dashboard
│   │   ├── context/        # App State & Internationalization
│   │   └── utils/          # Formatting & Helpers
│   └── vercel.json         # Vercel Deployment Configuration
│
└── server/                 # Node.js + Express REST API (Hosted on Render)
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

## ☁️ Deployment Configuration

### Backend on Render
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV=production`
  - `MONGO_URI=<your-atlas-connection-string>`
  - `JWT_SECRET=<your-secret>`
  - `CLIENT_URL=https://roomnest.vercel.app`

### Frontend on Vercel
- **Root Directory**: `client`
- **Framework Preset**: `Vite`
- **Output Directory**: `dist`
- **Environment Variable**:
  - `VITE_API_URL=https://roomnest-m8uu.onrender.com/api`

---

## 📄 License
This project is licensed under the MIT License.
