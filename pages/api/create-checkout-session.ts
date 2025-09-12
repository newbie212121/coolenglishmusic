// pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

/**
 * Very light ID token parser.
 * (For production, verify the token using aws-jwt-verify. This keeps build simple.)
 */
function getUserSubFromAuthHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length);
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  try {
    const json = Buffer.from(payloadB64, 'base64').toString('utf8');
    const payload = JSON.parse(json);
    return typeof payload?.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // omit apiVersion to avoid TS mismatch

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userSub = getUserSubFromAuthHeader(req.headers.authorization);
  if (!userSub) {
    return res.status(401).json({ message: 'Missing or invalid ID token' });
  }

  const { priceId } = req.body as { priceId?: string };
  if (!priceId) {
    return res.status(400).json({ message: 'Missing priceId' });
  }

  try {
    const successUrl = `${process.env.SITE_URL}/members?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.SITE_URL}/pricing`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userSub,
      metadata: { userSub },
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err);
    return res.status(500).json({ message: err?.message ?? 'Server error' });
  }
}
