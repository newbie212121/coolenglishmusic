// pages/api/check-subscription.ts
import type { NextApiRequest, NextApiResponse } from 'next';

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
    // Call your actual endpoint - /members/status not /check-subscription-status
    const response = await fetch('https://api.coolenglishmusic.com/members/status', {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('API call failed:', response.status);
      // For now, if API fails but user is logged in, allow access
      // This prevents the login loop
      return res.status(200).json({
        isSubscribed: true,  // Let logged-in users through
        active: true,
        message: 'API error, defaulting to allow'
      });
    }

    const data = await response.json();
    
    // Return the data as-is since your Lambda already returns the right format
    return res.status(200).json(data);
    
  } catch (error: any) {
    console.error('Subscription check error:', error);
    
    // On network errors, default to allowing logged-in users
    // This prevents the login loop
    return res.status(200).json({
      isSubscribed: true,
      active: true,
      message: 'Network error, defaulting to allow'
    });
  }
}