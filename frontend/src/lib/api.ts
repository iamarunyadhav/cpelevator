// Thin client for the Laravel backend (see /backend). Used by every service in src/services.
const BASE = String(import.meta.env["VITE_API_URL"] || "http://localhost:8000/api").replace(/\/$/, "");
const TOKEN_KEY = "ce_admin_token";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export const tokenStore = {
  get: () => (typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY)),
  set: (token: string) => window.localStorage.setItem(TOKEN_KEY, token),
  clear: () => window.localStorage.removeItem(TOKEN_KEY),
};

type Options = { method?: string; body?: unknown; auth?: boolean };

export async function api<T = any>(path: string, { method = "GET", body, auth = false }: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = auth ? tokenStore.get() : null;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let payload: BodyInit | null = null;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) { headers["Content-Type"] = "application/json"; payload = JSON.stringify(body); }

  let res: Response;
  try { res = await fetch(`${BASE}${path}`, { method, headers, body: payload }); }
  catch { throw new ApiError("Could not reach the server. Please try again.", 0); }

  if (res.status === 401 && auth) tokenStore.clear();
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message = res.status === 429 ? "Too many attempts. Please wait a minute and try again." : data?.message || "Something went wrong";
    throw new ApiError(message, res.status);
  }
  return (res.status === 204 ? null : await res.json()) as T;
}
