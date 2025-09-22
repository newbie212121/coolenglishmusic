// pages/api/check-subscription.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.coolenglishmusic.com';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No auth = not subscribed (but don't throw error)
    return res.status(200).json({ 
      isSubscribed: false,
      active: false 
    });
  }

  try {
    // Call your ACTUAL endpoint - /members/status
    const response = await fetch(`${API_BASE}/members/status`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json(data);
    }

    // API error - return false (don't crash)
    console.error('API returned:', response.status);
    return res.status(200).json({
      isSubscribed: false,
      active: false
    });
    
  } catch (error: any) {
    console.error('Network error checking subscription:', error.message);
    // Network error - return false (don't crash)
    return res.status(200).json({
      isSubscribed: false,
      active: false
    });
  }
}