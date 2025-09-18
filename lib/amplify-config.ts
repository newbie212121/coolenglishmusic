// lib/amplify-config.ts
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      loginWith: {
        oauth: {
          domain: (process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "").replace(/^https?:\/\//, ""),
          scopes: ["openid", "email", "profile"],
          redirectSignIn: [process.env.NEXT_PUBLIC_LOGIN_REDIRECT!],
          redirectSignOut: [process.env.NEXT_PUBLIC_LOGOUT_REDIRECT!],
          responseType: "code",
        },
      },
    },
  },
};

export default amplifyConfig;
export { amplifyConfig };
