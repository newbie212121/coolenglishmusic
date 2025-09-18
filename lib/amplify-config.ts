// lib/amplify-config.ts
export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      loginWith: {
        oauth: {
          // IMPORTANT: strip https:// from the domain
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!.replace(/^https?:\/\//, ''),
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [process.env.NEXT_PUBLIC_LOGIN_REDIRECT!],
          redirectSignOut: [process.env.NEXT_PUBLIC_LOGOUT_REDIRECT!],
          responseType: 'code',
        },
      },
    },
  },
};

// allow both named and default imports
export default amplifyConfig;
