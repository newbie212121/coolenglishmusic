// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import { AuthProvider } from "../context/AuthContext";

// ✅ Configure Amplify directly from env vars (no JSON file needed)
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!, // e.g. 7cjtqru...auth.us-east-1.amazoncognito.com
          scopes: ["email", "openid", "profile"],
          redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGNIN!],   // e.g. https://coolenglishmusic.com/login/callback
          redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGNOUT!], // e.g. https://coolenglishmusic.com/logout
          responseType: "code",
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
