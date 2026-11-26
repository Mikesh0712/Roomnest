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
# 1. Run the Private Local Security Sandbox (Interactive Terminal):
npm run sandbox
# Or: node ../security-sandbox-lab/sandbox.js

# Or test individual attack vectors:
node ../security-sandbox-lab/sandbox.js ddos        # 30-request flood & 429 Rate Limit
node ../security-sandbox-lab/sandbox.js xss         # Input sanitization & XSS
node ../security-sandbox-lab/sandbox.js redos       # Catastrophic regex backtracking
node ../security-sandbox-lab/sandbox.js privilege   # Role whitelist rejection (400)
node ../security-sandbox-lab/sandbox.js buffer      # 150KB body parser ceiling (413)
node ../security-sandbox-lab/sandbox.js bottleneck  # Concurrency bottleneck profiling
node ../security-sandbox-lab/sandbox.js dom         # DOM manipulation & React/CSP audit

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

## 🔒 Private Local Security Sandbox (GUI & Terminal)

Detailed in [`security-sandbox-lab/README.md`](../security-sandbox-lab/README.md):
- **Terminal CLI:** `node security-sandbox-lab/sandbox.js` (Interactive prompt with colorized audit logs).
- **Offline HTML GUI:** Double-click `security-sandbox-lab/local-ui.html` to run attacks and bottleneck analysis in your local browser without deploying internal tools to the public website.

