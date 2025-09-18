// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import { AuthProvider } from "../context/AuthContext";
import NavBar from "../components/landing/NavBar"; // ← mount NavBar globally

// Configure Amplify from env vars (no JSON file required)
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
          scopes: ["email", "openid", "profile"],
          redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGNIN!],
          redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGNOUT!],
          responseType: "code",
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <NavBar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
