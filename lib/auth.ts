// lib/auth.ts
// Lightweight Cognito Hosted UI auth (Implicit/OIDC) for Next.js (Pages Router).
// Requires these env vars to be set (both in .env.local and Amplify hosting):
//   NEXT_PUBLIC_COGNITO_DOMAIN=https://<your-domain>.auth.<region>.amazoncognito.com
//   NEXT_PUBLIC_COGNITO_CLIENT_ID=<your app client id>
//   NEXT_PUBLIC_LOGIN_REDIRECT=https://<your-site>/login/callback
//   NEXT_PUBLIC_LOGOUT_REDIRECT=https://<your-site>/
//
// Your pages call:
//   auth.login()            -> kicks off Hosted UI
//   auth.handleAuthCallback()  (on /login/callback)
//   auth.getIdToken()
//   auth.getUserId()
//   auth.logout()

const COGNITO_DOMAIN = (process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "").replace(/\/+$/, "");
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "";
const LOGIN_REDIRECT = process.env.NEXT_PUBLIC_LOGIN_REDIRECT || "";
const LOGOUT_REDIRECT = process.env.NEXT_PUBLIC_LOGOUT_REDIRECT || "";

const ID_TOKEN_KEY = "coolenglish_id_token";
const ACCESS_TOKEN_KEY = "coolenglish_access_token";
const EXPIRES_AT_KEY = "coolenglish_expires_at";
const STATE_KEY = "coolenglish_oauth_state";

const isBrowser = typeof window !== "undefined";

function makeState(): string {
  if (isBrowser && window.crypto?.getRandomValues) {
    return Array.from(window.crypto.getRandomValues(new Uint32Array(2)))
      .map((n) => n.toString(36))
      .join("");
  }
  return Math.random().toString(36).slice(2);
}

function base64UrlDecode(input: string): string {
  // Convert base64url to base64
  let b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  // Pad
  const pad = b64.length % 4;
  if (pad) b64 += "=".repeat(4 - pad);
  if (!isBrowser) return Buffer.from(b64, "base64").toString("utf8");
  // Browser
  try {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(b64), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return "";
  }
}

function decodeJwtPayload<T = any>(jwt: string): T | null {
  const parts = jwt.split(".");
  if (parts.length < 2) return null;
  try {
    const json = base64UrlDecode(parts[1]);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function saveTokens(idToken: string, accessToken?: string, expiresInSec?: number) {
  if (!isBrowser) return;
  localStorage.setItem(ID_TOKEN_KEY, idToken);
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

  // Prefer exp from the JWT if present; else use expires_in
  const payload = decodeJwtPayload<{ exp?: number }>(idToken);
  let expiresAt = 0;
  if (payload?.exp) {
    expiresAt = payload.exp * 1000;
  } else if (expiresInSec) {
    expiresAt = Date.now() + expiresInSec * 1000;
  }
  if (expiresAt) localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
}

function clear() {
  if (!isBrowser) return;
  localStorage.removeItem(ID_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  sessionStorage.removeItem(STATE_KEY);
}

function getIdToken(): string | null {
  if (!isBrowser) return null;
  const token = localStorage.getItem(ID_TOKEN_KEY);
  const exp = Number(localStorage.getItem(EXPIRES_AT_KEY) || 0);
  if (exp && Date.now() > exp) {
    clear();
    return null;
  }
  return token;
}

function getUserId(): string | null {
  const token = getIdToken();
  if (!token) return null;
  const payload = decodeJwtPayload<{ sub?: string }>(token);
  return payload?.sub ?? null;
}

function login() {
  if (!isBrowser) return;

  // CSRF protection
  const state = makeState();
  sessionStorage.setItem(STATE_KEY, state);

  // Request an ID token (and access token) via Implicit flow
  const url =
    `${COGNITO_DOMAIN}/oauth2/authorize` +
    `?response_type=${encodeURIComponent("id_token token")}` + // use "id_token" if you don't need access_token
    `&client_id=${encodeURIComponent(CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(LOGIN_REDIRECT)}` +
    `&scope=${encodeURIComponent("openid email profile")}` +
    `&state=${encodeURIComponent(state)}`;

  window.location.href = url;
}

function logout() {
  if (!isBrowser) return;
  clear();
  const url =
    `${COGNITO_DOMAIN}/logout` +
    `?client_id=${encodeURIComponent(CLIENT_ID)}` +
    `&logout_uri=${encodeURIComponent(LOGOUT_REDIRECT)}`;
  window.location.href = url;
}

function handleAuthCallback() {
  if (!isBrowser) return;

  // Hash fragment: id_token, access_token, expires_in, token_type, state, (or error)
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.substring(1)
    : window.location.hash;
  const params = new URLSearchParams(hash);

  // Handle Hosted UI error cases
  const error = params.get("error");
  if (error) {
    console.error("Cognito error:", error, params.get("error_description"));
    clear();
    return;
  }

  // CSRF protection
  const incoming = params.get("state");
  const expected = sessionStorage.getItem(STATE_KEY);
  if (!incoming || !expected || incoming !== expected) {
    console.error("State mismatch — possible CSRF.");
    clear();
    return;
  }
  sessionStorage.removeItem(STATE_KEY);

  const idToken = params.get("id_token") || "";
  const accessToken = params.get("access_token") || undefined;
  const expiresIn = Number(params.get("expires_in") || 0) || undefined;

  if (!idToken) {
    console.error("No id_token found in callback.");
    clear();
    return;
  }

  saveTokens(idToken, accessToken, expiresIn);
}

export const auth = {
  login,
  logout,
  handleAuthCallback,
  getIdToken,
  getUserId,
  clear,
};
