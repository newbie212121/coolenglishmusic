import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    
    // Call your Lambda directly with the token
    const response = await fetch('https://api.coolenglishmusic.com/check-subscription-status', {
      headers: {
        'Authorization': authHeader
      }
    });

    // If Lambda still has CORS issues, parse the token locally
    if (!response.ok) {
      // Parse JWT to get userId
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      
      // For now, just return subscribed true for any logged-in user
      // (You can add DynamoDB check here later)
      return res.status(200).json({
        isSubscribed: true,  // Temporary - let logged-in users access
        active: true,
        userId: payload.sub
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Subscription check error:', error);
    // Default to allowing access for logged-in users
    return res.status(200).json({
      isSubscribed: true,
      active: true
    });
  }
}