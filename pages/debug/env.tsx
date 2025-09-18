// pages/debug/env.tsx
export default function EnvViewer() {
  const env = {
    NEXT_PUBLIC_COGNITO_DOMAIN: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
    NEXT_PUBLIC_LOGIN_REDIRECT: process.env.NEXT_PUBLIC_LOGIN_REDIRECT,
    NEXT_PUBLIC_LOGOUT_REDIRECT: process.env.NEXT_PUBLIC_LOGOUT_REDIRECT,
    NEXT_PUBLIC_COGNITO_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_POOL_ID,
    NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  };

  return (
    <div style={{ padding: 24, color: "#e5e7eb", background: "#000", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>Runtime Env (public)</h1>
      <pre style={{ whiteSpace: "pre-wrap", background: "rgba(255,255,255,0.04)", padding: 16, borderRadius: 8 }}>
        {JSON.stringify(env, null, 2)}
      </pre>
      <p style={{ marginTop: 16, opacity: 0.7 }}>Remove this file after we verify deployment.</p>
    </div>
  );
}
