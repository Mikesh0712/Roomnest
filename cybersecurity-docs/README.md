# 🛡️ RoomNest Cybersecurity Knowledge Base & Defense Kit

Welcome to the centralized cybersecurity documentation, audit reports, threat mitigation models, and interview guides for the **RoomNest** platform.

---

## 📚 Contents in this Folder:

1. **[DATABASE_THEFT_PREVENTION_LAB.md](DATABASE_THEFT_PREVENTION_LAB.md)**  
   * **Topic:** How RoomNest prevents database dump exfiltration and competitor clone websites.
   * **Techniques:** AES-256-GCM Envelope Encryption, Key Management separation, Digital Canary Honeypots & Cryptographic Watermarking.
   * **Live Simulation:** Detailed explanation of `npm run demo:theft` and the Attacker vs Legitimate Developer roleplay.

2. **[CYBERSECURITY_INTERVIEW_CHEATSHEET.md](CYBERSECURITY_INTERVIEW_CHEATSHEET.md)**  
   * **Topic:** Top 10 Technical Interview Questions on AppSec, CWE, and OWASP Top 10.
   * **Format:** Question ➔ File to Open ➔ Exact Code Snippet ➔ Word-for-Word Hinglish Dialogue.

3. **[SECURITY.md](SECURITY.md)**  
   * **Topic:** Full Enterprise Application Security (AppSec) report.
   * **Standards:** OWASP Top 10 (2021), NIST SP 800-53, CWE Top 25, Microsoft STRIDE threat model.

4. **[interview_questions_50.txt](interview_questions_50.txt)** & **[interview_answers_50.txt](interview_answers_50.txt)**  
   * **Topic:** 50 Full-Stack and SDE-1 / Associate Software Engineer interview questions and in-depth answers.

---

## ⚡ Quick Test Commands (Run from `server` folder):

```bash
# 1. Live Attack Simulator Arena (CLI): Tests DDoS, XSS, ReDoS, Privilege Escalation, Buffer Overflow
npm run simulate:attacks

# Or test individual attack vectors:
node scripts/attack-simulator.js ddos
node scripts/attack-simulator.js xss
node scripts/attack-simulator.js redos
node scripts/attack-simulator.js privilege
node scripts/attack-simulator.js buffer

# 2. Run the 16-test Automated Security Suite (OWASP Top 10)
npm run test:security

# 3. Run the Database Theft & Attack Mitigation Simulation (Professor Lab)
npm run demo:theft

# 4. Simulate Attacker attempting to crack stolen database dump
node attacker_tool.js

# 5. Simulate Legitimate Developer decrypting database dump with Vault Key
node legitimate_reader.js
```

---

## 🌐 Interactive Web Security Lab (UI Arena)

You can also trigger and visualize every attack live in the web browser:
1. Open [https://roomnest.vercel.app](https://roomnest.vercel.app) (or `http://localhost:5173`).
2. Click the **"Security Lab"** tab in the top navigation bar (marked with a red Shield Alert icon `🛡️`).
3. Click any attack button:
   - **Launch HTTP Flood (DDoS)**: Sends rapid requests and triggers live HTTP 429 warnings.
   - **Inject Stored XSS**: Demonstrates recursive script tag and event handler stripping.
   - **Execute ReDoS Attack**: Demonstrates catastrophic regex query neutralization.
   - **Attempt Privilege Escalation**: Demonstrates role whitelist rejection of `admin`.
   - **Send 150KB Buffer Overflow**: Demonstrates `100kb` body parser truncation and HTTP 413.
4. Watch the real-time **Defensive Audit Log** terminal update instantly on the right side of the screen.

