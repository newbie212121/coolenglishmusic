import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import amplifyConfig from "../lib/amplify-config";   // default import works now
import { AuthProvider } from "@/context/AuthContext";

Amplify.configure({ ...amplifyConfig, ssr: true });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
