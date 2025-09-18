import type { AppProps } from "next/app";
import "@/styles/globals.css";

import { Amplify } from "aws-amplify";
// use your existing config object from /lib/amplify-config.ts
import amplifyConfig from "@/lib/amplify-config";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";

Amplify.configure(amplifyConfig);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
