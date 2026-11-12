# 🛡️ RoomNest: Top 10 Cybersecurity Interview Q&A Cheatsheet
> **Purpose:** Step-by-Step Code Walkthrough Guide for Technical Interviews  
> **Target Roles:** Associate Cybersecurity Engineer / AppSec QA / Full-Stack Security Fresher  
> **Format:** Question ➔ File Path ➔ Exact Code Snippet ➔ Spoken Hinglish Dialogue

---

### Q1. "How did you prevent User Input Sanitization & Stored XSS in your application?"
* **📂 File to Open:** `server/src/utils/sanitize.js` (and `server/src/app.js`)
* **💻 Code to Show:**
  ```javascript
  // server/src/utils/sanitize.js
  export const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:[^"'\s]*/gi, '')
      .replace(/\bon\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };
  ```
* **🗣️ Screen dekh kar kya bolna hai (Hinglish):**
  > *"Sir, pehle user review ya title me malicious JavaScript tags bhej sakta tha jo Stored XSS ban jata. Humne `sanitizeString` banaya jo `<script>`, `<iframe>`, `javascript:` URL aur inline event handlers jaise `onerror=` ya `onload=` ko filter karta hai aur `<` `>` ko HTML entities me encode kar deta hai. Aur ise humne `server/src/app.js` me `app.use(sanitizeMiddleware)` banakar globally mount kiya hai taaki controller tak data hamesha clean hokar hi pahunche."*
* **🎯 Vulnerability Prevented:** CWE-79 (Cross-Site Scripting - Stored & Reflected).

---

### Q2. "How did you handle Buffer Overflow and Memory Exhaustion in Node.js?"
* **📂 File to Open:** `server/src/app.js` (Line ~56)
* **💻 Code to Show:**
  ```javascript
  // server/src/app.js
  // Buffer overflow / DoS protection: limit standard JSON payload size to 100kb
  app.use(express.json({ limit: '100kb' }));
  ```
* **🗣️ Screen dekh kar kya bolna hai (Hinglish):**
  > *"Sir, C/C++ me buffer overflow se memory pointers overwrite hote hain, lekin Node.js/V8 environment me attack **Memory Exhaustion DoS** hota hai. Pehle Express ka default body limit 10MB tha, jisse hacker massive JSON payloads bhejkar server RAM aur event loop ko crash kar sakta tha. Humne ise strict **100kb** par cap kar diya. Agar koi 100kb se bada payload bhejta hai, toh Express `413 Payload Too Large` fek kar turant connection close kar deta hai."*
* **🎯 Vulnerability Prevented:** CWE-400 (Uncontrolled Resource Consumption / Payload Flooding DoS).

---

### Q3. "Why did you cap passwords at 72 characters? How does that prevent CPU starvation?"
* **📂 File to Open:** `server/src/validators/auth.validator.js`
* **💻 Code to Show:**
  ```javascript
  // server/src/validators/auth.validator.js
  export const registerSchema = z.object({
    password: z.string()
      .min(6, 'Password must be at least 6 characters')
      .max(72, 'Password must not exceed 72 characters to prevent bcrypt CPU exhaustion attacks')
  });
  ```
* **🗣️ Screen dekh kar kya bolna hai (Hinglish):**
  > *"Sir, Bcrypt algorithm internally sirf first 72 bytes process karta hai. Agar koi attacker 50,000 character lamba string password field me bhejega, toh Bcrypt ka mathematical computation Node.js ke single-threaded event loop ko kayi seconds ke liye freeze kar dega (CPU Starvation DoS). Isliye humne Zod schema me strictly `.max(72)` limit lagayi hai taaki bada string hashing function tak pahunch hi na sake."*
* **🎯 Vulnerability Prevented:** CWE-307 / CWE-400 (Cryptographic CPU Starvation DoS).

---

### Q4. "How did you prevent Vertical Privilege Escalation during User Registration?"
* **📂 File to Open:** `server/src/validators/auth.validator.js` & `server/src/services/auth.service.js`
* **💻 Code to Show:**
  ```javascript
  // server/src/validators/auth.validator.js
  const PUBLIC_REGISTRATION_ROLES = [ROLES.TENANT, ROLES.OWNER, ROLES.BROKER];

  role: z.enum(PUBLIC_REGISTRATION_ROLES, {
    errorMap: () => ({ message: 'Invalid role. Administrative roles cannot be self-assigned.' })
  }).default(ROLES.TENANT)
  ```
  ```javascript
  // server/src/services/auth.service.js
  if (role === 'admin') {
    throw new ApiError(403, 'Privilege escalation violation: Administrative accounts cannot be registered publicly');
  }
  ```
* **🗣️ Screen dekh kar kya bolna hai (Hinglish):**
  > *"Sir, pehle registration schema me `Object.values(ROLES)` use ho raha tha, jisme `admin` bhi included tha. Koi bhi hacker Postman se `{"role": "admin"}` bhejkar direct admin ban sakta tha. Humne **Defense-in-Depth** lagaya: pehle Validator level par public roles whitelist kiye (`tenant, owner, broker`), aur Service level par secondary guard lagaya ki agar koi validator bypass bhi kare, toh `role === 'admin'` par turant `403 Forbidden` raise ho jaye."*
* **🎯 Vulnerability Prevented:** CWE-269 (Improper Privilege Management / Vertical Privilege Escalation).

---

### Q5. "What is an IDOR vulnerability, and how did you resolve it in Property Management?"
* **📂 File to Open:** `server/src/services/property.service.js` (Function `confirmAvailability`)
* **💻 Code to Show:**
  ```javascript
  // server/src/services/property.service.js
  export const confirmAvailability = async (id, user) => {
    const property = await Property.findById(id);
    if (!property) throw new ApiError(404, 'Property listing not found');

    // Broken Access Control / IDOR Defense
    const isOwner = property.owner && property.owner.toString() === user._id.toString();
    const isBroker = property.broker && property.broker.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isBroker && !isAdmin) {
      throw new ApiError(403, 'Access denied: You do not have permission to confirm availability for this property');
    }
    property.lastAvailabilityConfirmedAt = new Date();
    await property.save();
    return property;
  };
  ```
* **🗣️ Screen dekh kar kya bolna hai (Hinglish):**
  > *"Sir, IDOR (Insecure Direct Object Reference) tab hota hai jab server sirf ye check karta hai ki user logged in hai ya nahi, lekin ye check nahi karta ki kya wo us specific record ka owner hai. Pehle koi bhi user kisi doosre owner ki property ID daal kar uski availability date alter kar sakta tha. Humne object-level authorization add kiya jo `property.owner.toString() === user._id.toString()` verify karta hai. Agar match nahi hota, toh `403 Forbidden` milta hai."*
* **🎯 Vulnerability Prevented:** CWE-639 (Authorization Bypass Through User-Controlled Key / IDOR).

---

### Q6. "How did you secure Visit Requests against Unauthorized Cancellation/Rescheduling?"
* **📂 File to Open:** `server/src/services/visit.service.js` (Function `updateVisitStatus`)
* **💻 Code to Show:**
  ```javascript
  // server/src/services/visit.service.js
  export const updateVisitStatus = async (visitId, statusData, user) => {
    const visit = await Visit.findById(visitId);
    if (!visit) throw new ApiError(404, 'Visit request not found');

    const isTenant = visit.tenant && visit.tenant.toString() === user._id.toString();
    const isOwner = visit.owner && visit.owner.toString() === user._id.toString();
    const isBroker = visit.broker && visit.broker.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isTenant && !isOwner && !isBroker && !isAdmin) {
      throw new ApiError(403, 'Access denied: You do not have permission to modify this visit request');
    }
    // Update logic follows...
  ```
* **🗣️ Screen dekh kar kya bolna hai (Hinglish):**
  > *"Sir, pehle `updateVisitStatus` me `user` parameter receive toh ho raha tha lekin verify nahi ho raha tha. Iska matlab koi bhi stranger kisi doosre tenant ki schedule visit ko cancel ya manipulate kar sakta tha. Humne check lagaya ki caller ya toh booking karne wala tenant hona chahiye, ya listing ka owner/broker, ya system admin. Koi teesra banda `403 Access Denied` ke bina aage nahi badh sakta."*
* **🎯 Vulnerability Prevented:** CWE-284 (Improper Access Control / Horizontal IDOR).

---

### Q7. "What is ReDoS (Regular Expression Denial of Service) and how did you prevent it?"
* **📂 File to Open:** `server/src/utils/sanitize.js` (Function `escapeRegex`) & `server/src/services/property.service.js`
* **💻 Code to Show:**
  ```javascript
  // server/src/utils/sanitize.js
  export const escapeRegex = (string) => {
    if (typeof string !== 'string') return '';
    const truncated = string.slice(0, 100);
    return truncated.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  ```
  ```javascript
  // server/src/services/property.service.js
  if (city) query.city = new RegExp(`^${escapeRegex(city)}$`, 'i');
  if (locality) query.locality = new RegExp(escapeRegex(locality), 'i');
  ```
* **🗣️ Screen dekh kar kya bolna hai (Hinglish):**
  > *"Sir, search bar me hum dynamic `new RegExp(city, 'i')` use kar rahe the. Agar koi hacker nested grouping payload bhejta jaise `((a+)+)+$`, toh V8 regex engine catastrophic backtracking me chala jaata aur CPU 100% load par freeze ho jaati. Humne `escapeRegex` function banaya jo input ko 100 characters pe truncate karta hai aur saare regex metacharacters (`.*+?^${}()|[]\`) ko escape (`\\$&`) kar deta hai taaki input strictly plain text ki tarah match ho."*
* **🎯 Vulnerability Prevented:** CWE-1333 (Inefficient Regular Expression Complexity / ReDoS).

---

### Q8. "How does your backend prevent NoSQL Injection in MongoDB queries?"
* **📂 File to Open:** `server/src/app.js` (Line ~59) & `server/src/validators/property.validator.js`
* **💻 Code to Show:**
  ```javascript
  // server/src/app.js
  // NoSQL query selector injection mitigation ($gt, $ne, etc.)
  app.use(mongoSanitize());
  ```
* **🗣️ Screen dekh kar kya bolna hai (Hinglish):**
  > *"Sir, MongoDB me SQL injection ki jagah NoSQL Query Injection hota hai jahan hacker body ya query me object bhejta hai jaise `{"$gt": ""}` taaki password check bypass ho jaye ya saara data dump ho jaye. Humne do controls lagaye hain: pehla `express-mongo-sanitize` jo request me se `$` aur `.` wali keys ko strip kar deta hai, aur doosra Zod validation jo input ko strictly string ya number enforce karta hai, query object accept nahi karta."*
* **🎯 Vulnerability Prevented:** CWE-943 (Improper Neutralization of Data within Query Expressions / NoSQL Injection).

---

### Q9. "How did you prevent Sensitive Data Exposure and Information Leakage?"
* **📂 File to Open:** `server/src/models/User.js` (Line ~87)
* **💻 Code to Show:**
  ```javascript
  // server/src/models/User.js
  toJSON: {
    transform(doc, ret) {
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    }
  }
  ```
* **🗣️ Screen dekh kar kya bolna hai (Hinglish):**
  > *"Sir, Information Disclosure tab hota hai jab API response me hashed passwords, internal database version keys (`__v`), ya server stack traces leak hote hain. Humne Mongoose schema me `toJSON` transform hook lagaya hai taaki jab bhi User object JSON me convert ho, `passwordHash` aur internal keys automatically delete ho jayein. Iske alawa Helmet ke through strict HTTP headers (`noSniff`, `X-Frame-Options: DENY`, aur CSP) set kiye hain."*
* **🎯 Vulnerability Prevented:** CWE-209 / CWE-359 (Information Exposure Through Sensitive Details).

---

### Q10. "How can you prove all this code actually works and wasn't just copy-pasted?"
* **📂 File to Open:** `server/tests/security.test.js` (and terminal)
* **💻 Command to Run Live:**
  ```bash
  cd server
  npm run test:security
  ```
* **💻 Code to Show:**
  ```javascript
  // server/tests/security.test.js
  describe('🛡️ Cybersecurity Vulnerability & Defensive Controls Test Suite', () => {
    it('should reject passwords exceeding 72 characters to prevent bcrypt CPU starvation DoS', () => {
      const massivePassword = 'A'.repeat(73);
      const result = registerSchema.safeParse({ ...sample, password: massivePassword });
      expect(result.success).toBe(false);
    });
    it('should strictly reject "admin" role during public user registration in schema', () => {
      const result = registerSchema.safeParse({ ...sample, role: 'admin' });
      expect(result.success).toBe(false);
    });
    it('should block unauthorized users from confirming availability of another user property', async () => {
      // Asserts 403 Forbidden...
    });
  });
  ```
* **🗣️ Screen dekh kar kya bolna hai (Hinglish):**
  > *"Sir, kisi bhi security claim ko prove karne ka industry-standard tareeqa **Automated Regression Testing** hota hai. Maine Jest me `server/tests/security.test.js` likha hai jisme 16 automated penetration tests hain. Hum specific attack vectors pass karte hain—jaise 73-char password, `<script>` tags, admin role injection, aur IDOR attack. Agar aap permit karein toh main abhi terminal me **`npm run test:security`** run karke dikha sakta hoon, jahan saare 16 tests green pass hote hain."*
* **🎯 Proof Standard:** Automated AppSec Verification & Continuous Integration readiness.

