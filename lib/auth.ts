export const auth = {
  login() {
    const d = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
    const c = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
    const r = encodeURIComponent(process.env.NEXT_PUBLIC_LOGIN_REDIRECT!);
    window.location.href = `${d}/oauth2/authorize?client_id=${c}&response_type=token&scope=openid+email+profile&redirect_uri=${r}`;
  },
  logout() {
    const d = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
    const c = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
    const u = encodeURIComponent(process.env.NEXT_PUBLIC_LOGOUT_REDIRECT!);
    window.location.href = `${d}/logout?client_id=${c}&logout_uri=${u}`;
  },
  getIdToken(): string | null {
    if (typeof window === "undefined") return null;
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const t = hash.get("id_token");
    if (t) {
      localStorage.setItem("id_token", t);
      window.history.replaceState({}, "", window.location.pathname);
      return t;
    }
    return localStorage.getItem("id_token");
  },
  clear() { localStorage.removeItem("id_token"); }
};
