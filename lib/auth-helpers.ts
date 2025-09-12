// lib/auth-helpers.ts
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

/** Returns the raw ID token string (JWT) or null if logged out. */
export async function getIdTokenString(): Promise<string | null> {
  const s = await fetchAuthSession();
  return s.tokens?.idToken?.toString() ?? null;
}

/** Returns the Cognito user "sub" (stable user id) or null if logged out. */
export async function getUserSub(): Promise<string | null> {
  const s = await fetchAuthSession();
  return s.userSub ?? null;
}

/** Lightweight check: true if a user is signed in, else false. */
export async function isLoggedIn(): Promise<boolean> {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
}
