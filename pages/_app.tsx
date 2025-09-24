// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import { amplifyConfig } from "@/lib/amplify-config";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import AuthGate from "@/components/AuthGate";
import { useDeviceTracking } from "@/lib/useDeviceTracking";  // Changed from @/hooks to @/lib

Amplify.configure(amplifyConfig);

export default function App({ Component, pageProps }: AppProps) {
  useDeviceTracking(); // Add this line here
  
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