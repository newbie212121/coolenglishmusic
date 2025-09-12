// lib/auth.ts

// 👇 Reads your configuration securely from the environment variables
const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const LOGIN_REDIRECT = process.env.NEXT_PUBLIC_LOGIN_REDIRECT!;
const LOGOUT_REDIRECT = process.env.NEXT_PUBLIC_LOGOUT_REDIRECT!;

const ID_TOKEN_KEY = 'coolenglish_id_token';
const STATE_KEY = 'coolenglish_auth_state';

// --- Core Functions ---

const login = () => {
  if (typeof window === 'undefined') return;
  const state = crypto.randomUUID();
  window.sessionStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    response_type: 'id_token token',
    client_id: CLIENT_ID,
    redirect_uri: LOGIN_REDIRECT,
    scope: 'openid email profile',
    state: state,
  });

  const url = `${COGNITO_DOMAIN}/login?${params.toString()}`;
  window.location.href = url;
};

const logout = () => {
  if (typeof window === 'undefined') return;
  clear();
  
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    logout_uri: LOGOUT_REDIRECT,
  });

  const url = `${COGNITO_DOMAIN}/logout?${params.toString()}`;
  window.location.href = url;
};

const handleAuthCallback = () => {
  if (typeof window === 'undefined') return;

  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);

  const id_token = params.get('id_token');
  const state = params.get('state');
  const error = params.get('error');

  const storedState = window.sessionStorage.getItem(STATE_KEY);
  window.sessionStorage.removeItem(STATE_KEY);

  if (state !== storedState) {
    throw new Error('Invalid state. Authentication failed.');
  }

  if (error) {
    throw new Error(`Cognito error: ${error}`);
  }

  if (id_token) {
    window.localStorage.setItem(ID_TOKEN_KEY, id_token);
  } else {
    throw new Error('ID token not found in callback URL.');
  }
};

const getIdToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

const getUserId = (): string | null => {
  const token = getIdToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  } catch (e) {
    console.error('Failed to parse ID token:', e);
    return null;
  }
};

const clear = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

// --- Exported Auth Object ---

export const auth = {
  login,
  logout,
  handleAuthCallback,
  getIdToken,
  getUserId,
  clear,
};