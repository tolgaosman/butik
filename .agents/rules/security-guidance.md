---
description: "Security rules specifically for the Laravel and Next.js architecture."
trigger: "model_decision"
---

# Security Guidance

- **Sanctum Auth:** Respect the CSRF cookie cycle. Ensure `apiMutate` always includes credentials and handles 419 token mismatches gracefully.
- **Admin Endpoints:** Never expose administrative data or actions outside the `/api/admin/*` protected route group.
- **Input Validation:** Always validate inputs on both the frontend (Zod/HTML5) and the backend (Laravel FormRequests).
- **XSS Prevention:** In React, never use `dangerouslySetInnerHTML` without properly sanitizing the input via DOMPurify or similar.
- **Mass Assignment:** In Laravel models, ensure `$fillable` is strictly defined to prevent malicious parameter injection.
