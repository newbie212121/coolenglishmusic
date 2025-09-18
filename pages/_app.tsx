// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";

// Try to load the Amplify config from common locations so it works in all environments
let amplifyConfig: any = {};
try {
  // If your file is at /src/amplifyconfiguration.json (common with Amplify Gen2)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  amplifyConfig = require("../src/amplifyconfiguration.json");
} catch {}
if (!amplifyConfig || Object.keys(amplifyConfig).length === 0) {
  try {
    // If your file is at /amplifyconfiguration.json (project root)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    amplifyConfig = require("../amplifyconfiguration.json");
  } catch {}
}

Amplify.configure(amplifyConfig);

import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
