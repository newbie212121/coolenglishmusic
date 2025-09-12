import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const API_VERSION: Stripe.LatestApiVersion = '2024-04-10';

// Pull Bearer token from header (for auth) — unchanged
function headerBearer(req: NextApiRequest): string | null {
  const raw = req.headers.authorization || '';
  const [scheme, token] = raw.split(' ');
  return scheme?.toLowerCase() === 'bearer' && token ? token : null;
}

function userSubFromJwt(idToken: string | null): string | undefined {
  try {
    if (!idToken) return undefined;
    const payloadB64 = idToken.split('.')[1];
    const json = Buffer.from(payloadB64, 'base64').toString('utf8');
    const payload = JSON.parse(json);
    return payload?.sub as string | undefined;
  } catch {
    return undefined;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // IMPORTANT: read env at request time (not top-level)
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

    if (!STRIPE_SECRET_KEY) {
      // Don’t attempt Stripe calls without a key; tell us clearly instead
      return res.status(500).json({
        message: 'Server misconfiguration: STRIPE_SECRET_KEY is not set.',
      });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: API_VERSION });

    const { priceId, idToken: idTokenFromBody } =
      (req.body || {}) as { priceId?: string; idToken?: string };

    if (!priceId) {
      return res.status(400).json({ message: 'Missing priceId' });
    }

    // accept token from header or body
    const idToken = headerBearer(req) ?? idTokenFromBody ?? null;
    if (!idToken) {
      return res.status(401).json({ message: 'Missing ID token' });
    }

    const userSub = userSubFromJwt(idToken);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/members?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/pricing?canceled=1`,
      client_reference_id: userSub,
      metadata: userSub ? { cognito_sub: userSub } : undefined,
      automatic_tax: { enabled: true },
    });

    if (!session.url) {
      return res.status(500).json({ message: 'Stripe did not return a URL.' });
    }

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('create-checkout-session error:', err);
    return res
      .status(typeof err?.statusCode === 'number' ? err.statusCode : 500)
      .json({ message: err?.message || 'Internal Server Error' });
  }
}
