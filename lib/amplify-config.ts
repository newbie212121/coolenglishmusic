// lib/amplify-config.ts
import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  const domain = (process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/+$/, '');

  Amplify.configure(
    {
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_COGNITO_POOL_ID!,
          userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
          // (Optional) tell Amplify which identifiers you allow
          loginWith: {
            username: false,
            email: true,
            phone: false,
            oauth: {
              domain,                                // e.g. us-xxx.auth.us-east-1.amazoncognito.com
              scopes: ['openid', 'email', 'profile'],
              redirectSignIn: [process.env.NEXT_PUBLIC_LOGIN_REDIRECT!],   // https://.../login/callback
              redirectSignOut: [process.env.NEXT_PUBLIC_LOGOUT_REDIRECT!], // https://.../
              responseType: 'code',                  // <-- Code + PKCE (recommended)
            },
          },
        },
      },
    },
    { ssr: true }
  );
};
