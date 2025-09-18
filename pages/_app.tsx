// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import { amplifyConfig } from "@/lib/amplify-config";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import AuthGate from "@/components/AuthGate";

Amplify.configure(amplifyConfig);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AuthGate>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthGate>
    </AuthProvider>
  );
}
