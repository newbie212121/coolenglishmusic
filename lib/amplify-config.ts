// lib/amplify-config.ts
import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  Amplify.configure(
    {
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_COGNITO_POOL_ID!,
          userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
          loginWith: {
            oauth: {
              // IMPORTANT: domain without https://
              domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!.replace(/^https?:\/\//, ''),
              scopes: ['openid', 'email', 'profile'],
              redirectSignIn: [process.env.NEXT_PUBLIC_LOGIN_REDIRECT!],
              redirectSignOut: [process.env.NEXT_PUBLIC_LOGOUT_REDIRECT!],
              responseType: 'code',
            },
          },
        },
      },
    },
    { ssr: true }
  );
};
