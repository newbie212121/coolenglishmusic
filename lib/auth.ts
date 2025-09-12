// lib/auth.ts

// These should match the values in your .env.local file and Amplify environment variables
const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
const LOGIN_REDIRECT = process.env.NEXT_PUBLIC_LOGIN_REDIRECT;
const LOGOUT_REDIRECT = process.env.NEXT_PUBLIC_LOGOUT_REDIRECT;

const ID_TOKEN_KEY = 'coolenglish_id_token';

// --- Helper Functions ---

const login = () => {
  const url = `${COGNITO_DOMAIN}/login?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${LOGIN_REDIRECT}`;
  if (typeof window !== 'undefined') window.location.href = url;
};

const logout = () => {
  clear(); // Clear local token first
  const url = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${LOGOUT_REDIRECT}`;
  if (typeof window !== 'undefined') window.location.href = url;
};

const getIdToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

const clear = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

// This new function handles saving the token from the URL after login
const handleAuthCallback = () => {
  if (typeof window === 'undefined') return;
  
  // The token is returned in the URL hash after the '#'
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const id_token = params.get('id_token');

  if (id_token) {
    window.localStorage.setItem(ID_TOKEN_KEY, id_token);
  }
};

// This is the new function that was missing
const getUserId = (): string | null => {
  const token = getIdToken();
  if (!token) {
    return null;
  }
  try {
    // The user ID is in the middle part of the token (the payload)
    const payload = JSON.parse(atob(token.split('.')[1]));
    // 'sub' is the standard JWT claim for the user's unique ID
    return payload.sub; 
  } catch (e) {
    console.error('Failed to parse JWT token:', e);
    return null;
  }
};

// Export all functions in the auth object
export const auth = { 
  login, 
  logout, 
  getIdToken, 
  clear, 
  handleAuthCallback, 
  getUserId 
};