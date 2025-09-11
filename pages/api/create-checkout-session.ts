// pages/api/create-checkout-session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe'; // 1. Use ES module import instead of require

// 2. Initialize Stripe with the secret key
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

    const validPriceIds = [
      'prod_T2JJm7mMUyAqXB',
      'prod_T2JKWau3raWyd5'
    ];

    if (!validPriceIds.includes(priceId)) {
      return res.status(400).json({ message: 'Invalid Price ID' });
    }

    const ANNUAL_DISCOUNT_COUPON_ID = 'coupon_..._YOUR_COUPON_ID';
    const isAnnual = priceId === 'price_..._YOUR_ANNUAL_ID';

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      discounts: isAnnual ? [{ coupon: ANNUAL_DISCOUNT_COUPON_ID }] : [],
      success_url: `${req.headers.origin}/members?success=true`,
      cancel_url: `${req.headers.origin}/pricing?canceled=true`,
    });

    res.status(200).json({ url: session.url });

  } catch (err) { // 3. Handle the error type safely
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error(err);
    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
}