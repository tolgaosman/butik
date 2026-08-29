/**
 * Server components fetch the public catalog directly against Laravel — it's
 * unauthenticated data and SSR must not borrow the visitor's session cookie.
 * The browser goes through the same-origin Next.js proxy (see next.config.ts)
 * so Sanctum's session cookie stays first-party.
 */
function apiBase(): string {
  if (typeof window === "undefined") {
    return process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000/api";
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "/api";
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  /** The full parsed error response, for endpoints that return structured
   *  data beyond message/errors (e.g. a delete confirmation payload). */
  body?: unknown;

  constructor(status: number, message: string, errors?: Record<string, string[]>, body?: unknown) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.body = body;
  }
}

type FetchOptions = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

/**
 * GET helper for the public catalog. Returns `undefined` on 404 and throws
 * on every other failure — callers that need a soft fallback (lists) should
 * catch and return `[]` so a down API renders the existing empty state
 * instead of a 500.
 */
export async function apiGet<T>(path: string, options?: FetchOptions): Promise<T | undefined> {
  const res = await fetch(`${apiBase()}${path}`, {
    headers: { Accept: "application/json" },
    ...options,
  });

  if (res.status === 404) return undefined;

  if (!res.ok) {
    throw new ApiError(res.status, `Request failed: ${path}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Server-side GET that DOES forward the visitor's session cookie. The rule
 * apiGet follows — SSR never borrows the session — protects the public
 * catalog from caching one visitor's data for everyone; the admin panel is
 * the deliberate exception: /api/admin/* is behind auth:sanctum + is_admin,
 * so the request has to carry the session. Always uncached.
 */
export async function apiGetAuthed<T>(path: string): Promise<T | undefined> {
  const { cookies } = await import("next/headers");
  const cookieHeader = (await cookies()).toString();

  const res = await fetch(`${apiBase()}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });

  if (res.status === 404) return undefined;

  if (!res.ok) {
    throw new ApiError(res.status, `Request failed: ${path}`);
  }

  return res.json() as Promise<T>;
}

let csrfReady: Promise<void> | null = null;

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrfCookie(): Promise<void> {
  csrfReady ??= fetch("/sanctum/csrf-cookie", { credentials: "include" }).then(() => undefined);
  await csrfReady;
}

/**
 * Mutating browser requests: cookie session + CSRF header. Retries once on
 * 419 (token rotates after login) by re-fetching the CSRF cookie.
 */
export async function apiMutate<T>(
  path: string,
  init: RequestInit & { method: "POST" | "PATCH" | "PUT" | "DELETE" },
): Promise<T> {
  await ensureCsrfCookie();

  const attempt = async () => {
    const token = getCookie("XSRF-TOKEN");
    const isFormData = init.body instanceof FormData;
    
    const headers: HeadersInit = {
      Accept: "application/json",
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(token ? { "X-XSRF-TOKEN": token } : {}),
      ...init.headers,
    };

    return fetch(`${apiBase()}${path}`, {
      ...init,
      credentials: "include",
      headers,
    });
  };

  let res = await attempt();

  if (res.status === 419) {
    csrfReady = null;
    await ensureCsrfCookie();
    res = await attempt();
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? "Request failed", body.errors, body);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
