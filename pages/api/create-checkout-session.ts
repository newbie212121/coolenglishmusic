// pages/api/create-checkout-session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    const { priceId } = req.body;
    
    if (!priceId) {
      return res.status(400).json({ message: 'Price ID is required' });
    }

    const monthlyPriceId = 'price_1S6EhJEWbhWs9Y6ojPLRnaJ7'; // Your real monthly ID
    const annualPriceId = 'price_1S6EiAEWbhWs9Y6oa0djiq82';   // Your real annual ID

    const validPriceIds = [monthlyPriceId, annualPriceId];

    if (!validPriceIds.includes(priceId)) {
      return res.status(400).json({ message: 'Invalid Price ID' });
    }

    const isAnnual = priceId === annualPriceId;
    const couponId = process.env.STRIPE_COUPON_ID!;

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      discounts: isAnnual ? [{ coupon: couponId }] : [],
      success_url: `${req.headers.origin}/members?success=true`,
      cancel_url: `${req.headers.origin}/pricing?canceled=true`,
    });

    res.status(200).json({ url: session.url });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error(err);
    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
}