// pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { verifyIdToken } from "@/lib/verify-jwt"; // if @ fails, use "../../lib/verify-jwt"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    // 1) Verify the Cognito ID token from Authorization header
    const { payload } = await verifyIdToken(req.headers.authorization);
    const sub = payload.sub as string;
    const email = (payload.email as string) || undefined;

    // 2) Require a Stripe priceId from the body
    const { priceId } = (req.body as { priceId?: string }) || {};
    if (!priceId) return res.status(400).json({ error: "Missing priceId" });

    // 3) Find or create Stripe customer keyed by Cognito sub
    const search = await stripe.customers.search({
      query: `metadata['cognito_sub']:'${sub}'`,
    });
    let customer = search.data[0];
    if (!customer) {
      customer = await stripe.customers.create({
        email,
        metadata: { cognito_sub: sub },
      });
    }

    // 4) Create subscription checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.SITE_URL}/members?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/pricing`,
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("create-checkout-session error:", err);
    const status = err?.message?.includes("Missing bearer token") ? 401 : 500;
    return res.status(status).json({ error: err.message ?? "Server error" });
  }
}
