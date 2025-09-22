// pages/api/check-subscription.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.coolenglishmusic.com';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Not authenticated',
      isSubscribed: false 
    });
  }

  try {
    // UPDATED: Using the actual endpoint path /members/status
    const response = await fetch(`${API_BASE}/members/status`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Subscription check failed:', data);
      
      // Return safe default for auth errors
      if (response.status === 401) {
        return res.status(200).json({
          isSubscribed: false,
          active: false,
          message: 'Authentication required'
        });
      }
      
      return res.status(response.status).json({
        isSubscribed: false,
        error: data.error || 'Subscription check failed'
      });
    }

    // Success - ensure we return the expected format
    return res.status(200).json({
      isSubscribed: data.isSubscribed || data.active || false,
      active: data.active || data.isSubscribed || false,
      userId: data.userId,
      status: data.status,
      currentPeriodEnd: data.currentPeriodEnd
    });
    
  } catch (error: any) {
    console.error('Subscription check error:', error);
    
    // Network or parsing error - return safe default
    return res.status(200).json({
      isSubscribed: false,
      active: false,
      error: 'Could not verify subscription'
    });
  }
}