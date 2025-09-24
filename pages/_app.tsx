// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import { amplifyConfig } from "@/lib/amplify-config";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import AuthGate from "@/components/AuthGate";
import { useDeviceTracking } from "@/lib/useDeviceTracking";

Amplify.configure(amplifyConfig);

// Create a wrapper component that uses the hook INSIDE AuthProvider
function AppWithDeviceTracking({ children }: { children: React.ReactNode }) {
  useDeviceTracking();
  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AppWithDeviceTracking>
        <AuthGate>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthGate>
      </AppWithDeviceTracking>
    </AuthProvider>
  );
}