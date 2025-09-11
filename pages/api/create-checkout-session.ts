// pages/api/create-checkout-session.ts
import { NextApiRequest, NextApiResponse } from 'next';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // We only allow POST requests to this endpoint
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

    // These are the IDs from your Stripe dashboard
    const validPriceIds = [
      'prod_T2JJm7mMUyAqXB',  // 👈 Replace with your $2/month Price ID
      'prod_T2JKWau3raWyd5'    // 👈 Replace with your $20/year Price ID
    ];

    if (!validPriceIds.includes(priceId)) {
      return res.status(400).json({ message: 'Invalid Price ID' });
    }

    // Get the Coupon ID from your Stripe dashboard for the 40% discount
    const ANNUAL_DISCOUNT_COUPON_ID = 'coupon_..._YOUR_COUPON_ID'; // 👈 Replace if you made one

    const isAnnual = priceId === 'price_..._YOUR_ANNUAL_ID'; // 👈 Use your annual ID again here

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      // Apply the 40% discount only if it's the annual plan
      discounts: isAnnual ? [{ coupon: ANNUAL_DISCOUNT_COUPON_ID }] : [],
      success_url: `${req.headers.origin}/members?success=true`,
      cancel_url: `${req.headers.origin}/pricing?canceled=true`,
    });

    res.status(200).json({ url: session.url });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}