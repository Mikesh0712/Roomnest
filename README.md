# 🏠 RoomNest — Hyperlocal Student & Professional Rental Housing Platform

> An intelligent, map-centric hyperlocal accommodation discovery and rental platform designed for students and working professionals near educational and tech hubs.

[![Live Website](https://img.shields.io/badge/🌐_Live_Demo-roomnest.vercel.app-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://roomnest.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Mikesh0712%2FRoomnest-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Mikesh0712/Roomnest)

---

> 💡 **Demo Showcase Note:**  
> Currently, this live deployment serves as a **functional proof-of-concept and prototype demonstration** designed to showcase the core user experience, hyperlocal radius mapping, verification systems, and rental workflow for early testing and investor presentations.

---

## 🔗 Live Showcase Links

- **🌐 Live Web Application:** [https://roomnest.vercel.app](https://roomnest.vercel.app)
- **⚡ Backend API Health:** [https://roomnest-m8uu.onrender.com/api/health](https://roomnest-m8uu.onrender.com/api/health)
- **📚 Interactive Swagger Docs:** [https://roomnest-m8uu.onrender.com/api/docs](https://roomnest-m8uu.onrender.com/api/docs)
- **🛡️ Cybersecurity Knowledge Base & Lab Reports:** [cybersecurity-docs/](cybersecurity-docs/)
- **📋 Interview 10-Question Cheatsheet:** [cybersecurity-docs/CYBERSECURITY_INTERVIEW_CHEATSHEET.md](cybersecurity-docs/CYBERSECURITY_INTERVIEW_CHEATSHEET.md)

---

## 🛡️ Cybersecurity & Defensive Architecture (OWASP Top 10)

RoomNest incorporates an enterprise-grade **Application Security (AppSec)** layer with automated regression testing, cryptographic field encryption, and defense-in-depth controls. Full threat modeling (STRIDE) and CWE mappings are documented in [cybersecurity-docs/SECURITY.md](cybersecurity-docs/SECURITY.md).

### 🧪 Run Automated Security Test Suite (16/16 Passing)
To verify all defensive controls against XSS, Buffer/Payload DoS, Privilege Escalation, ReDoS, and IDOR:

```bash
cd server
npm run test:security
```

```text
PASS tests/security.test.js
  🛡️ Cybersecurity Vulnerability & Defensive Controls Test Suite
    ✓ 1. Input Sanitization & Cross-Site Scripting (XSS) Prevention (4 tests)
    ✓ 2. Buffer Overflow & Memory Exhaustion Handling (Web Payload DoS) (4 tests)
    ✓ 3. Privilege Access Control (Vertical Privilege Escalation Defense) (2 tests)
    ✓ 4. Injection Attacks & ReDoS Prevention (3 tests)
    ✓ 5. Horizontal Privilege Escalation & IDOR Defense (2 tests)
    ✓ 6. Output Validation & Sensitive Field Masking (1 test)

Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
```

| Security Vector | Vulnerability Addressed | Defensive Mechanism |
| :--- | :--- | :--- |
| **XSS & Sanitization** | CWE-79 / Stored XSS | Recursive tag & event-handler strip (`sanitizeMiddleware`) |
| **Buffer Overflow / DoS** | CWE-400 / Memory Exhaustion | 100kb payload ceiling + Zod bounded schemas (max 72 chars for bcrypt) |
| **Privilege Escalation** | CWE-269 / Broken Access Control | Public registration whitelisting (blocks admin self-assignment) |
| **ReDoS & Injection** | CWE-1333 / Catastrophic Backtracking | `escapeRegex()` query metacharacter neutralization |
| **IDOR Defense** | CWE-639 / Broken Object Authorization | Object-level identity checks on property and visit updates |
| **Data Masking** | CWE-209 / Information Leakage | Mongoose `toJSON` projection masking of `passwordHash` and `__v` |

---

## ⚔️ Database Breach & Business Model Theft Mitigation (Live Demonstration)

> **Research Problem:** If an attacker or rogue competitor steals our raw database dump (`mongodump` / JSON export), can they launch a clone website overnight with our pre-fed listings?  
> **Solution:** **Application-Level Envelope Encryption (AES-256-GCM)** + **KMS Vault Key Separation** + **Digital Canary Watermarking**. Full lab report available in [cybersecurity-docs/DATABASE_THEFT_PREVENTION_LAB.md](cybersecurity-docs/DATABASE_THEFT_PREVENTION_LAB.md).

### 🎬 How to Perform the Live Step-by-Step Demonstration:

#### Option A: The Live Attacker vs Legitimate Developer Roleplay (2 Commands)
```bash
# Step 1: Open the stolen database dump file to show encrypted fields:
# File: server/stolen_dump.json -> Notice 'enc:iv:authTag:ciphertext'

# Step 2: Run the Attacker tool (Simulates competitor trying to decrypt without key):
node server/attacker_tool.js
# ❌ Result: CRITICAL ERROR: Decryption Failed (AEAD Tag Mismatch). Clone website crashes!

# Step 3: Run the Legitimate Developer tool (Authorized backend with Master Vault Key):
node server/legitimate_reader.js
# ✅ Result: Cleanly decrypts listings and catches digital canary trap watermark!
```

#### Option B: Full Interactive 5-Stage Simulation (Single Command)
```bash
cd server
npm run demo:theft
```
*Executes all 5 stages: Vulnerability Assessment ➔ Encryption Mitigation ➔ Attacker Clone Crash ➔ Forensic Canary Token Audit ➔ Authorized Tenant View.*

---

## 📁 Centralized Cybersecurity Documentation Kit

All security audit documentation, viva presentation guides, and interview prep files are organized in the [`cybersecurity-docs/`](cybersecurity-docs/) folder:

- **[`DATABASE_THEFT_PREVENTION_LAB.md`](cybersecurity-docs/DATABASE_THEFT_PREVENTION_LAB.md)**: In-depth lab writeup on database theft, KMS envelope encryption, and canary honeypots.
- **[`CYBERSECURITY_INTERVIEW_CHEATSHEET.md`](cybersecurity-docs/CYBERSECURITY_INTERVIEW_CHEATSHEET.md)**: Top 10 interview questions with exact files, code snippets, and spoken Hinglish dialogue.
- **[`SECURITY.md`](cybersecurity-docs/SECURITY.md)**: Enterprise AppSec report aligned with OWASP Top 10, NIST, and STRIDE threat modeling.
- **[`interview_questions_50.txt`](cybersecurity-docs/interview_questions_50.txt)** & **[`interview_answers_50.txt`](cybersecurity-docs/interview_answers_50.txt)**: 50 Full-Stack & SDE interview questions with answers.

---

## 🌟 Key Highlights & Features

- 🗺️ **Interactive Geographic Map**: Real-time Leaflet radius radar showing walking distance to universities and major colleges.
- ⚡ **Hyperlocal Distance & Cost Breakdown**: Exact breakdown of rent, deposit, maintenance, electricity tariffs, food options, and lock-in periods.
- 🛡️ **Verified Properties & Safety Rating**: Verification badges, student/tenant reviews, owner verification, and curfew/policy filters.
- 🔄 **Side-by-Side Property Comparison**: Instant comparative analysis of amenities, deposits, distances, and monthly costs.
- 🔒 **Secure Backend Architecture**: JWT Authentication, Rate Limiting, Mongo Sanitization, and Helmet Security.
- 🌐 **Multilingual Support**: English, Hindi, and Odia local language support.

---

## 🗺️ Future Roadmap & City Expansion

RoomNest is architected to scale rapidly from specialized student micro-markets into a nationwide rental infrastructure across all urban tiers:

```mermaid
flowchart LR
    A["Phase 1: Pilot Hubs\n(Tier-2 Student Clusters)"] --> B["Phase 2: Tier-1 Metros\n(University & IT Belts)"]
    B --> C["Phase 3: Tier-2 & Tier-3 Cities\n(Pan-India Growth Nodes)"]
```

### 📍 Planned Rollout Strategy:

1. **Phase 1 — Pilot Student & Coaching Clusters (Current Focus):**
   - Educational zones & university corridors (e.g., Bhubaneswar, Kota, Pune student suburbs).
   - Validation of hyperlocal radar search, verified owner listings, and direct tenant booking.

2. **Phase 2 — Tier-1 Metros & Tech Corridors:**
   - **Cities:** Bengaluru, Delhi NCR, Hyderabad, Mumbai, Pune, Chennai, Kolkata.
   - **Target Segments:** University campus clusters, coaching hubs (Mukherjee Nagar, Kalu Sarai), and tech park commuter belts (Whitefield, Hitec City, Hinjewadi).

3. **Phase 3 — Tier-2 & Tier-3 Growth Cities:**
   - **Cities:** Indore, Jaipur, Chandigarh, Lucknow, Dehradun, Coimbatore, Patna, Cuttack, Vadodara, Visakhapatnam, and emerging educational centers.
   - **Focus:** Standardizing unorganized PG/hostel ecosystems, vernacular localization, and transparent pricing in fast-growing college towns.

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
