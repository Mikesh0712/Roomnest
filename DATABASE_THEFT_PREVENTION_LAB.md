# 🛡️ Laboratory Report: Database Breach, Theft & Business Piracy Mitigation

> **Project:** RoomNest — Hyperlocal Student Rental Housing Platform  
> **Topic:** Mitigating Full Database Exfiltration, Business Model Duplication, and Competitor Clones  
> **Key Concepts:** Field-Level Envelope Encryption (AES-256-GCM), Key Management Separation, Digital Canary Tokens, Watermarking  
> **Standards Reference:** OWASP Top 10 (A02: Cryptographic Failures), CWE-312 (Cleartext Storage of Sensitive Information), India DPDP Act 2023

---

## 📌 1. The Core Problem Posed by the Professor

> *"If an attacker or malicious competitor steals our raw database dump (`mongodump` or SQL export), they can launch a clone platform with all our pre-fed listings, owner contacts, and student data in under 10 minutes. How do we mathematically and architecturally prevent a stolen database from being useful to a competitor?"*

---

## 🔍 2. Vulnerability Assessment & Threat Model

### Attack Vectors:
1. **Compromised Database Credentials / Connection String:** Attacker gains read-only access to MongoDB Atlas and executes `mongodump`.
2. **Exposed Database Backups:** S3 bucket backup containing unencrypted `.json` or `.archive` dumps is accidentally left world-readable.
3. **Malicious Insider Threat:** A rogue developer or contractor downloads the production database before resigning to start a clone venture.

### Impact & Risk:
- **CWE-312 (Cleartext Storage of Sensitive Information):** Storing phone numbers, Aadhaar details, and exact property locations in plaintext allows immediate unauthorized commercial use.
- **Business Model Annihilation:** The competitor acquires our entire curated housing inventory without paying customer acquisition costs (CAC).
- **Regulatory Penalties:** Heavy fines under the Indian Digital Personal Data Protection (DPDP) Act 2023 and EU GDPR for cleartext PII leakage.

---

## 🛡️ 3. The Multi-Layered Mitigation Architecture

RoomNest implements a **Zero-Knowledge Database Architecture** based on 3 cryptographic pillars:

```
[ Raw MongoDB Dump Stolen ]
             │
             ▼
┌────────────────────────────────────────────────────────┐
│  Stolen Records (Encrypted at Application Layer):     │
│  - ownerPhone: enc:c39ba353...:3ca63f...:d5a38a...     │
│  - ownerAadhaar: enc:180cab38...:de8c34...:f536e0...   │
│  - exactAddress: enc:49b0b99f...:eaaef6...:db8b1e...   │
│  - Canary Record: [HMAC-SHA256 Signed Trap]           │
└────────────────────────────────────────────────────────┘
             │
             ▼
    [ Competitor's Clone Server ]
             │
             ├──► Tries to decrypt without RoomNest KMS Master Key
             │    └──► ❌ CRITICAL: "AEAD Tag Mismatch" (Data unusable!)
             │
             └──► Imports canary honeypot record
                  └──► 🚨 Busted! Forensic HMAC watermark proves theft in court!
```

### Pillar 1: Field-Level Envelope Encryption (AES-256-GCM)
- Critical proprietary fields (`ownerPhone`, `ownerAadhaar`, `exactAddress`, `businessSecret`) are encrypted **before** insertion into MongoDB.
- **Key Decoupling:** The 256-bit AES master key **never lives in the database**. It resides strictly in the backend application runtime / Key Management Service (KMS).
- **AEAD (Authenticated Encryption with Associated Data):** GCM mode provides both confidentiality and integrity via an authentication tag (`authTag`). If the attacker alters even 1 bit of the stolen ciphertext, decryption fails with an integrity violation.

### Pillar 2: Digital Canary Honeypots & Watermarking
- Cryptographic honeypot listings are embedded into the dataset.
- Each canary record carries an **HMAC-SHA256 signature** signed by RoomNest's private secret.
- If a competitor publishes a clone site, querying our canary listings provides **irrefutable cryptographic evidence** in court for intellectual property theft and DMCA / copyright injunctions.

### Pillar 3: API Egress Masking & Rate Limiting
- Public endpoints only return partial masked data (`+91-98610-*****`) to prevent scraping bots from reconstructing the dataset via the web UI.

---

## 💻 4. Live Demonstration for the Professor (How to Run)

We built an automated, interactive demonstration script in `server/scripts/simulate-db-theft-demo.js`.

### Single Command to Run:
```bash
cd server
npm run demo:theft
```

---

## 🗣️ 5. Step-by-Step Viva Presentation Script (Line-by-Line)

Follow this 5-stage script when presenting to your professor:

### Step 1: Set the Context (Before running the command)
> *"Sir, aapne jo problem batayi thi ki agar koi competitor humara database dump chura le aur clone website launch kar de, usko humne mathematically aur architecturally solve kiya hai using **Application-Level Envelope Encryption (AES-256-GCM)** and **Digital Canary Tokens**. Main aapko iska live attack simulation run karke dikhata hoon."*

*(Open terminal, type `npm run demo:theft`, press Enter)*

### Step 2: Show Stage 1 (Unprotected Breach)
> *(Point to Stage 1 output)*  
> *"Sir, yahan dekhiye: agar standard database bina field encryption ke breach hota hai, toh dump file mein owner ka mobile number, Aadhaar number, aur exact flat address plain text mein leak ho jata hai. Competitor isko 5 minute mein apni clone site par load karke humara business model hijack kar sakta hai."*

### Step 3: Show Stage 2 (Protected Database)
> *(Point to Stage 2 output)*  
> *"Ab Stage 2 mein dekhiye sir: RoomNest mein humne **Field-Level Encryption** implement kiya hai. Database ke andar data `enc:iv:authTag:ciphertext` format mein store hota hai. Sabse zaroori baat ye hai ki **Decryption Key database ke andar hoti hi nahi hai**—wo server ke isolated environment mein hoti hai."*

### Step 4: Show Stage 3 (Attacker Fails to Launch Clone)
> *(Point to Stage 3 output)*  
> *"Stage 3 mein humne simulate kiya hai ki jab competitor is stolen database ko apni clone website par chalane ki koshish karta hai, toh bina valid Master Key ke decryption fail ho jata hai: `CRITICAL ERROR: Decryption Failed (AEAD Tag Mismatch)`. Uski clone website par koi bhi mobile number ya contact display nahi hoga—poora stolen database uske liye 100% useless ho gaya!"*

### Step 5: Show Stage 4 & 5 (Canary Proof & Legitimate Platform)
> *(Point to Stage 4 & 5 output)*  
> *"Aur sir, agar competitor ne smart banne ki koshish ki, toh Stage 4 mein humara **Digital Canary Honeypot Record** activate ho jata hai jisme HMAC-SHA256 signature embedded hai, jo court mein legal proof deta hai ki ye data RoomNest ka chori kiya hua hai.*  
> *Lekin jab humara verified tenant RoomNest platform se query karta hai (Stage 5), toh humara legitimate server on-the-fly authorized decryption karta hai aur data sahi dikhta hai."*

---

## 📊 Summary Comparison Matrix

| Security Parameter | Standard Unprotected Database | RoomNest Hardened Database |
| :--- | :--- | :--- |
| **Data at Rest** | Plaintext (`+91-98610-12345`) | AES-256-GCM Ciphertext (`enc:c39b...`) |
| **Key Location** | N/A (No encryption) | Isolated Application Server KMS (Outside DB) |
| **Utility of Stolen Dump** | **100% Usable** (Instant Clone Site) | **0% Usable** (Gibberish / Decryption Crash) |
| **Tamper Resistance** | None | Cryptographic AEAD Authentication Tag |
| **Forensic Theft Proof** | Difficult to prove in court | **HMAC-SHA256 Canary Signature** |
| **Compliance** | Violates DPDP Act 2023 | Aligned with Zero-Knowledge Encryption Standards |
