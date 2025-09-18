// lib/amplify-config.ts
import type { ResourcesConfig } from "aws-amplify";

const domain = (process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "").replace(/^https?:\/\//, "");

export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      loginWith: {
        oauth: {
          domain,
          scopes: ["openid", "email", "profile"],
          redirectSignIn: [process.env.NEXT_PUBLIC_LOGIN_REDIRECT!],   // e.g. https://coolenglishmusic.com/login/callback
          redirectSignOut: [process.env.NEXT_PUBLIC_LOGOUT_REDIRECT!], // e.g. https://coolenglishmusic.com/
          responseType: "code",
        },
      },
    },
  },
};
