// lib/amplify-config.ts
import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  Amplify.configure(
    {
      Auth: {
        Cognito: {
          // 🔒 hard-coded to your pool + the client you showed in your screenshot
          userPoolId: 'us-east-1_XFxa8jC5S',
          userPoolClientId: '7cjtqru06qs2jelqq25i3ocoa0',
          loginWith: {
            oauth: {
              // domain WITHOUT https:// (Amplify v6 expects bare hostname)
              domain: 'us-east-1xfxa8jc5s.auth.us-east-1.amazoncognito.com',
              scopes: ['openid', 'email', 'profile'],
              // these MUST match the app client's lists exactly
              redirectSignIn: ['https://main.d36vamn6zdb2sp.amplifyapp.com/login/callback'],
              redirectSignOut: ['https://main.d36vamn6zdb2sp.amplifyapp.com/'],
              responseType: 'code', // PKCE code flow
            },
          },
        },
      },
    },
    { ssr: true }
  );
};
