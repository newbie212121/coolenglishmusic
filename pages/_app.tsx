// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import amplifyconfig from '../amplifyconfiguration.json';
import { AuthProvider } from "@/context/AuthContext";

Amplify.configure(amplifyconfig);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
