# 🛡️ RoomNest Private Security Sandbox & Attack Lab

Welcome to the **RoomNest Private Security Testing Sandbox**. This is an isolated, local-only developer environment designed for vulnerability assessment, architectural load profiling, and live defense demonstration for academic viva examinations and technical interviews.

> 🔒 **Privacy Note:**  
> This sandbox runs **strictly on your local machine** and is completely decoupled from the production website (`roomnest.vercel.app`). The public website remains clean, professional, and free of internal testing interfaces.

---

## ⚡ How to Run the Local Sandbox

### Option 1: Interactive Terminal Sandbox (Recommended)
Run the interactive terminal CLI directly from your project root:

```bash
# Launch the Interactive Terminal Menu:
node security-sandbox-lab/sandbox.js

# Or run a targeted test directly:
node security-sandbox-lab/sandbox.js ddos       # Test 1: 30-request flood & 429 Rate Limit
node security-sandbox-lab/sandbox.js xss        # Test 2: Input sanitization & XSS
node security-sandbox-lab/sandbox.js redos      # Test 3: Catastrophic regex backtracking
node security-sandbox-lab/sandbox.js privilege  # Test 4: Role whitelist rejection (400)
node security-sandbox-lab/sandbox.js buffer     # Test 5: 150KB body parser ceiling (413)
node security-sandbox-lab/sandbox.js bottleneck # Test 6: Concurrency bottleneck profiling
node security-sandbox-lab/sandbox.js dom        # Test 7: DOM manipulation & React/CSP audit
node security-sandbox-lab/sandbox.js db         # Test 8: Database theft & AES-256-GCM AEAD cracking
node security-sandbox-lab/sandbox.js all        # Run all 8 audits in sequence
```

---

### Option 2: Graphical Local Dashboard (Offline HTML UI)
If you prefer a visual GUI with dark-mode panels and a live reactive terminal:
1. Navigate to the `security-sandbox-lab/` folder on your computer.
2. Double-click or open **`local-ui.html`** in your browser (Chrome, Edge, Firefox).
3. Click any attack or profiling button to trigger the test against the live backend and watch the logs stream in real-time.

---

## 🔬 Deep-Dive: Bottlenecks & DOM Manipulation (For Professor & Interviews)

---

### 1. System Bottleneck Analysis (Concurrency & Event Loop)

#### ❓ What is a Bottleneck in Node.js?
In a single-threaded runtime like Node.js, a bottleneck occurs when incoming requests get delayed or frozen due to:
1. **Event Loop Starvation:** Synchronous CPU-intensive tasks (e.g. nested regexes, heavy JSON parsing, unthreaded crypto).
2. **Database Connection Pool Exhaustion:** When hundreds of incoming HTTP requests attempt to open new MongoDB connections without pooling limits.
3. **Unbounded Query Memory Exhaustion:** An endpoint like `GET /api/properties?limit=1000000` loading entire database collections into the V8 heap, causing Garbage Collection (GC) pauses or Out-Of-Memory (OOM) crashes.
4. **Missing Database Indexes:** Querying collections without compound indexes forces MongoDB to perform a Full Table Scan ($O(N)$), causing severe I/O latency.

#### 🛡️ How RoomNest Prevents & Resolves Bottlenecks:
* **MongoDB Indexing:** We defined compound indexes on `{ city: 1, locality: 1 }` and `{ price: 1 }` in `server/src/models/property.model.js`. Searches execute in $O(\log N)$ logarithmic index lookups instead of $O(N)$ table scans.
* **Bounded Pagination Ceiling:** In `property.controller.js`, queries enforce a strict pagination cap:
  ```javascript
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  ```
  Even if an attacker sends `?limit=999999`, the server caps it at 50, preventing memory spikes.
* **Mongoose Connection Pool:** The database connector uses `maxPoolSize: 10`, reusing established socket connections instead of spawning costly new handshakes.
* **Async/Await Non-Blocking Architecture:** All controllers utilize non-blocking asynchronous promises, ensuring the Node.js event loop stays free to process thousands of concurrent requests.

#### 🗣️ Spoken Hinglish Viva Script for Bottlenecks:
> *"Sir, Node.js ek single-threaded event loop architecture par chalta hai. Agar hum unindexed database queries ya unbounded pagination (`limit=100000`) allow kar dein, toh server par **I/O bottleneck** aur **memory starvation** create ho jata hai, jisse dusre genuine users ki requests queue mein phas jati hain.*  
> *Is bottleneck ko solve karne ke liye humne 4 defensive layers lagayi hain:*  
> *1. MongoDB mein `{ city: 1, locality: 1 }` par **Compound Indexing** ki hai, jisse search $O(N)$ table scan se ghat kar $O(\log N)$ index lookup ho gayi.*  
> *2. Hard pagination cap lagaya hai jo maximum 50 records se upar memory mein load hone hi nahi deta.*  
> *3. Mongoose connection pool (`maxPoolSize: 10`) banaya hai taaki database connections reuse hon aur pool exhaust na ho.*  
> *4. Pura code asynchronous non-blocking async/await mein likha hai taaki event loop kabhi block na ho."*

---

### 2. Client-Side DOM Manipulation & DOM-Based XSS

#### ❓ What is DOM Manipulation & DOM-Based XSS?
DOM-based vulnerabilities occur on the client-side when untrusted data is written into an execution sink:
* **Dangerous DOM Sinks in Vanilla JS:**
  - `element.innerHTML = userInput;`
  - `document.write(userInput);`
  - `location.href = "javascript:" + userInput;`
  - `eval(userInput);`
* If a developer uses `innerHTML`, the browser HTML parser parses tags like `<img src=x onerror=alert(document.cookie)>` or `<script>`, executing malicious JavaScript in the victim's session.

#### 🛡️ How RoomNest Defends Against DOM Manipulation:
1. **React Virtual DOM Auto-Escaping (TextNode Sanitization):**
   - RoomNest is built with modern React. When rendering user-submitted text (like a property title or review):
     ```jsx
     <h3>{property.title}</h3>
     ```
   - React does **NOT** use `element.innerHTML`. Instead, it uses `document.createTextNode()`.
   - Characters like `<`, `>`, `"`, and `'` are treated as harmless literal text strings, making script execution in the DOM virtually impossible.
2. **Prohibition of Dangerous Sinks:**
   - The entire codebase strictly avoids `dangerouslySetInnerHTML`, `eval()`, or raw `document.write()`.
3. **HTTP Content Security Policy (CSP) & Helmet Headers:**
   - The backend includes Helmet middleware which sets:
     - `X-Content-Type-Options: nosniff`: Prevents browsers from guessing file MIME types and executing masqueraded scripts.
     - `X-Frame-Options: SAMEORIGIN`: Prevents Clickjacking and malicious iframe overlays.
     - `Strict-Transport-Security (HSTS)`: Enforces HTTPS encryption.

#### 🗣️ Spoken Hinglish Viva Script for DOM Manipulation:
> *"Sir, DOM Manipulation attack mein attacker client-side par aise injection sinks target karta hai jo raw HTML evaluate karte hain, jaise `element.innerHTML`, `document.write()`, ya `eval()`.*  
> *Vanilla JavaScript mein agar koi `innerHTML` use kare, toh browser script tag ko execute kar deta hai.*  
> *Lekin RoomNest mein humne do level par defense kiya hai:*  
> *1. Frontend React Virtual DOM par chalta hai jo data rendering ke liye `document.createTextNode` use karta hai. Iska matlab agar koi `<script>` ya `<img onerror>` bhejega bhi, toh React use executable code nahi balki plain harmless string ki tarah render karega.*  
> *2. Backend par humne `helmet` middleware configure kiya hai jo production mein strict security headers return karta hai (`nosniff`, `SAMEORIGIN`, HSTS) jo browser-level DOM tampering aur clickjacking ko block karte hain."*

---

## 📋 Complete Matrix of Simulated Defense Vectors

| # | Attack Vector | Target Endpoint | Vulnerability (CWE) | Defensive Mechanism | HTTP Result |
|---|---|---|---|---|---|
| **1** | **DDoS / HTTP Flood** | `/api/auth/login` | CWE-400 (Resource Exhaustion) | `authLimiter` (max 20 reqs/15m) | **HTTP 429** Too Many Requests |
| **2** | **Stored & Reflected XSS** | `/api/properties` | CWE-79 (Cross-Site Scripting) | `sanitizeMiddleware` recursive tag strip | **Sanitized Safe HTML** |
| **3** | **Catastrophic ReDoS** | `/api/properties?city=...` | CWE-1333 (Regex Backtracking) | `escapeRegex()` literal escaping | **Sub-second 200 OK** |
| **4** | **Privilege Escalation** | `/api/auth/register` | CWE-269 (Broken Access Control) | Zod `PUBLIC_REGISTRATION_ROLES` whitelist | **HTTP 400** Bad Request |
| **5** | **Buffer Overflow / DoS** | `/api/auth/login` | CWE-400 (Memory Exhaustion) | `express.json({ limit: '100kb' })` | **HTTP 413** Payload Too Large |
| **6** | **System Bottleneck** | `/api/properties` | Architecture / Event Loop Lag | Compound Indexes + MaxPoolSize 10 + Pagination Clamp | **High Throughput / Low Latency** |
| **7** | **DOM Manipulation** | Client UI / React DOM | CWE-79 (Client-Side DOM XSS) | React `createTextNode` + Helmet Security Headers | **Text Escaping + CSP nosniff** |
| **8** | **Database Theft & Cracking** | `stolen_dump.json` | CWE-311 / CWE-312 (Data at Rest) | AES-256-GCM Envelope Encryption + KMS Vault Separation | **AEAD Tag Mismatch Crash** |

