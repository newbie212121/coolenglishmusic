// lib/verify-jwt.ts
import { CognitoJwtVerifier } from "aws-jwt-verify";

// Allow fallback to your NEXT_PUBLIC_* vars so you don't need to duplicate them
const userPoolId =
  process.env.COGNITO_USER_POOL_ID ?? process.env.NEXT_PUBLIC_COGNITO_POOL_ID!;
const clientId =
  process.env.COGNITO_CLIENT_ID ?? process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;

export const cognitoIdVerifier = CognitoJwtVerifier.create({
  userPoolId,
  clientId,
  tokenUse: "id",
});

export async function verifyIdToken(authHeader?: string) {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing bearer token");
  }
  const token = authHeader.slice("Bearer ".length);
  const payload = await cognitoIdVerifier.verify(token);
  return { token, payload }; // payload.sub, payload.email, …
}
