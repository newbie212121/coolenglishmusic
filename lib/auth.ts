// lib/auth.ts

// 👇 Your actual Cognito details are now here
const COGNITO_DOMAIN = "https://us-east-1xfxa8jc5s.auth.us-east-1.amazoncognito.com";
const CLIENT_ID = "7cjtqru06qs2jelqq25i3ocoa0";

// 👇 Your redirect URLs from Amplify
const LOGIN_REDIRECT = "https://main.d36vamn6zdb2sp.amplifyapp.com/login/callback";
const LOGOUT_REDIRECT = "https://main.d36vamn6zdb2sp.amplifyapp.com/";

const ID_TOKEN_KEY = 'coolenglish_id_token';
const STATE_KEY = 'coolenglish_auth_state';

// --- Core Functions ---

const login = () => {
  if (typeof window === 'undefined') return;

  // 1. Create and store a random state value for security (CSRF protection)
  const state = crypto.randomUUID();
  window.sessionStorage.setItem(STATE_KEY, state);

  // 2. Build the correct login URL with required parameters
  const params = new URLSearchParams({
    response_type: 'id_token token', // Request both ID and Access tokens
    client_id: CLIENT_ID,
    redirect_uri: LOGIN_REDIRECT,
    scope: 'openid email profile', // Request standard OIDC scopes
    state: state, // Include the random state
  });

  const url = `${COGNITO_DOMAIN}/login?${params.toString()}`;
  window.location.href = url;
};

const logout = () => {
  if (typeof window === 'undefined') return;
  clear(); // Clear local storage first
  
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
  window.sessionStorage.removeItem(STATE_KEY); // Clean up state

  // 3. Security Check: Validate the state
  if (state !== storedState) {
    throw new Error('Invalid state. Authentication failed.');
  }

  // Handle errors from Cognito
  if (error) {
    throw new Error(`Cognito error: ${error}`);
  }

  // 4. If an ID token is present, save it
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
    return payload.sub; // 'sub' is the standard JWT claim for the user ID
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