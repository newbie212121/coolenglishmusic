// lib/amplify-config.ts
import type { ResourcesConfig } from "aws-amplify";

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      loginWith: {
        oauth: {
          // domain must be hostname only (no protocol)
          domain: (process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "").replace(/^https?:\/\//, ""),
          scopes: ["openid", "email", "profile"] as const,
          redirectSignIn: [process.env.NEXT_PUBLIC_LOGIN_REDIRECT!],
          redirectSignOut: [process.env.NEXT_PUBLIC_LOGOUT_REDIRECT!],
          responseType: "code" as const,
        },
      },
    },
  },
} satisfies ResourcesConfig;

export default amplifyConfig;
