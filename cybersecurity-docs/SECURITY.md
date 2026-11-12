# 🛡️ RoomNest Application Security (AppSec) & Threat Mitigation Report

> **Target Role:** Associate Security Engineer / Cybersecurity Fresher / AppSec Quality Assurance  
> **Status:** Security Hardened & Automated Test Verified (16/16 Automated Security Tests Passing)  
> **Standards Alignment:** OWASP Top 10 (2021), NIST SP 800-53, CWE Top 25

---

## 📌 Executive Summary

RoomNest implements a **Defense-in-Depth (DiD)** architecture protecting against modern web application threats, automated attacks, and business logic flaws. Rather than relying solely on single-point security controls, every layer—from HTTP headers to database query sanitization—enforces isolation, least privilege, and strict boundary validation.

```
       [ Client Request ]
               │
               ▼
   [ Layer 1: Edge & Headers ]         Helmet (CSP, HSTS, noSniff) + Rate Limiting
               │
               ▼
   [ Layer 2: Transport & Memory ]     JSON Body Throttling (100kb DoS / Buffer Limit)
               │
               ▼
   [ Layer 3: Input Sanitization ]     express-mongo-sanitize + Recursive XSS Strip
               │
               ▼
   [ Layer 4: Schema Validation ]      Zod (Strict Type & Max String Bounding)
               │
               ▼
   [ Layer 5: Authorization & RBAC ]   JWT Auth + Resource Ownership (IDOR Defense)
               │
               ▼
   [ Layer 6: Query & Storage ]        escapeRegex (ReDoS Defense) + Mongoose Projections
               │
               ▼
   [ Layer 7: Output Validation ]      toJSON Masking (Zero PasswordHash / Version Leak)
```

---

## 🔍 Vulnerability Mitigation & CWE Mapping

| Vulnerability Category | Associated CWE / OWASP | Pre-Remediation Risk | Implemented Defensive Control | Automated Verification |
| :--- | :--- | :--- | :--- | :--- |
| **User Input Sanitization** | **CWE-79** (Improper Neutralization / XSS)<br>`A03:2021-Injection` | High: Stored XSS via listing titles, descriptions, and user reviews. | Recursive HTML escaping and tag stripping (`<script>`, `<iframe>`, `javascript:`, `onerror=`) in `sanitizeMiddleware`. | `security.test.js` (Test 1.1–1.4) |
| **Buffer Overflow / Payload DoS** | **CWE-400** (Uncontrolled Resource Consumption)<br>`A04:2021-Insecure Design` | High: 10MB payload allowance leading to V8 heap memory exhaustion. | Strict 100kb body limit on Express parser (`express.json({ limit: '100kb' })`). | `security.test.js` (Test 2.1–2.4) |
| **Password CPU Exhaustion (DoS)** | **CWE-307** / **CWE-400** (Improper Restriction of Excessive Auth Attempts) | Medium-High: Unbounded password length passing into `bcrypt.hash()` causing event loop freeze. | Enforced strict `z.string().max(72)` matching bcrypt's effective limit. | `security.test.js` (Test 2.1) |
| **ReDoS (Regular Expression DoS)** | **CWE-1333** (Inefficient Regular Expression Complexity) | High: User search queries injected into `new RegExp()` causing catastrophic backtracking. | `escapeRegex()` escapes all metacharacters (`.*+?^${}()|[]\`) and truncates query to 100 chars. | `security.test.js` (Test 4.1–4.3) |
| **Vertical Privilege Escalation** | **CWE-269** (Improper Privilege Management)<br>`A01:2021-Broken Access Control` | Critical: Public signup allowing `role: "admin"`. | Schema whitelisting (`PUBLIC_ROLES = [tenant, owner, broker]`) + 403 Forbidden enforcement in service layer. | `security.test.js` (Test 3.1–3.2) |
| **Horizontal Escalation / IDOR** | **CWE-639** (Authorization Bypass Through User-Controlled Key)<br>`A01:2021-Broken Access Control` | High: Any user could modify another owner's property availability or visit request. | Object-level authorization validating `resource.owner.equals(user._id) \|\| user.role === 'admin'`. | `security.test.js` (Test 5.1–5.2) |
| **NoSQL Query Selector Injection** | **CWE-943** (Improper Neutralization in Data Query)<br>`A03:2021-Injection` | Medium-High: Query object injection using `{"$gt": ""}`. | `express-mongo-sanitize` + Zod scalar type coercion + disabled dynamic `$where`. | `security.test.js` (Test 1.4 & 4.3) |
| **Sensitive Data Exposure** | **CWE-209** / **CWE-359** (Information Exposure Through Environmental Details)<br>`A02:2021-Cryptographic Failures` | Medium: Leaking `passwordHash` or internal Mongoose version (`__v`) in API responses. | Mongoose `toJSON` transform explicitly deleting `passwordHash` and `__v`. | `security.test.js` (Test 6.1) |

---

## 🧪 Automated Security Test Suite (`tests/security.test.js`)

To ensure security is continuous and regression-free, an automated security test suite was built using Jest:

```bash
# Command to execute security test suite
cd server
node --experimental-vm-modules node_modules/jest/bin/jest.js tests/security.test.js --forceExit
```

### Verified Test Matrix:
```text
PASS tests/security.test.js
  🛡️ Cybersecurity Vulnerability & Defensive Controls Test Suite
    1. Input Sanitization & Cross-Site Scripting (XSS) Prevention
      ✓ should strip malicious <script> tags from user input
      ✓ should strip dangerous inline event handlers like onerror and onload
      ✓ should strip javascript: pseudo-protocol vectors
      ✓ should recursively sanitize nested request objects and ignore prototype pollution keys
    2. Buffer Overflow & Memory Exhaustion Handling (Web Payload DoS)
      ✓ should reject passwords exceeding 72 characters to prevent bcrypt CPU starvation DoS
      ✓ should reject oversized user names (>60 chars) and emails (>100 chars)
      ✓ should reject oversized review comments (>1000 chars) to prevent storage and heap flooding
      ✓ should reject oversized property titles (>120 chars) and descriptions (>3000 chars)
    3. Privilege Access Control (Vertical Privilege Escalation Defense)
      ✓ should strictly reject "admin" role during public user registration in schema
      ✓ should throw 403 Forbidden in auth service if role="admin" bypasses validator
    4. Injection Attacks & ReDoS Prevention
      ✓ should escape dangerous regex metacharacters in search queries
      ✓ should truncate excessively long regex input (>100 chars) to prevent ReDoS CPU exhaustion
      ✓ should return empty string safely when input is non-string
    5. Horizontal Privilege Escalation & IDOR Defense
      ✓ should block unauthorized users from confirming availability of another user property
      ✓ should block unauthorized users from modifying another user visit request
    6. Output Validation & Sensitive Field Masking
      ✓ should ensure passwordHash and internal version keys are masked in toJSON

Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        1.454 s
```

---

## 🎯 STRIDE Threat Model Breakdown

RoomNest was analyzed against the Microsoft **STRIDE** Threat Model:

1. **S**poofing Identity:
   - *Mitigation:* Stateless JWT signed with HMAC-SHA256, verified against database active/blocked state on every privileged request.
2. **T**ampering with Data:
   - *Mitigation:* Strict Zod schema typing, regex escaping, and input sanitization stripping markup before database commits.
3. **R**epudiation:
   - *Mitigation:* Centralized audit logging for administrative mutations (`AuditLog` model).
4. **I**nformation Disclosure:
   - *Mitigation:* Mongoose schema projection masking (`select: false` on `passwordHash`), removal of `__v`, centralized production error handling hiding stack traces.
5. **D**enial of Service (DoS):
   - *Mitigation:* Express IP-based rate limiting (`express-rate-limit`), 100kb payload caps, 72-char bcrypt bounds, and `escapeRegex` preventing ReDoS.
6. **E**levation of Privilege:
   - *Mitigation:* Role-Based Access Control (`roleMiddleware`) + Object-Level Access Control (IDOR validation). Public registration role whitelisting.

---

## 🚀 AppSec Roadmap for Production Scalability

For enterprise deployment, the following security initiatives are planned:
- [ ] **MFA / TOTP**: Multi-factor authentication for Owner and Admin portal access.
- [ ] **Token Rotation**: Short-lived access tokens (15m) paired with httpOnly, secure refresh token rotation stored in Redis.
- [ ] **CI/CD SAST/DAST Integration**: GitHub Actions workflow running `npm audit`, Snyk, and OWASP ZAP automated baseline scans.

