// pages/api/grant-share-access.ts
// Proxy route that calls the grant-share-access Lambda and handles cookie setting
// Follows the exact same pattern as your existing grant-access.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: "Share code required" });
  }
  
  const lambdaUrl = `https://api.coolenglishmusic.com/grant-share-access?code=${encodeURIComponent(code as string)}`;

  try {
    const lambdaResponse = await fetch(lambdaUrl, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    const data = await lambdaResponse.json();

    // Handle error responses
    if (lambdaResponse.status === 404) {
      return res.status(404).json({ 
        error: "invalid_share_link",
        message: "This share link is invalid"
      });
    }
    
    if (lambdaResponse.status === 410) {
      return res.status(410).json({ 
        error: "expired_share_link",
        message: "This share link has expired"
      });
    }
    
    if (lambdaResponse.status === 429) {
      return res.status(429).json({ 
        error: "limit_reached",
        message: "Share link access limit reached. Please ask your teacher for a new link."
      });
    }

    if (!lambdaResponse.ok) {
      return res.status(lambdaResponse.status).json({ 
        error: "Lambda request failed",
        details: data 
      });
    }

    // Success - fix cookies and return (EXACTLY like grant-access.ts)
    if (data.success && data.cookies && Array.isArray(data.cookies)) {
      // Fix empty domain in cookies
      const fixedCookies = data.cookies.map((cookie: string) => {
        if (cookie.includes('Domain=;')) {
          return cookie.replace('Domain=;', 'Domain=.coolenglishmusic.com;');
        }
        return cookie;
      });
      
      // Set all cookies
      res.setHeader("Set-Cookie", fixedCookies);

      return res.status(200).json({
        success: true,
        activityUrl: data.activityUrl,
        message: data.message || "Access granted"
      });
    }

    return res.status(500).json({ 
      error: "Invalid Lambda response",
      details: data
    });

  } catch (error: any) {
    console.error("Error in grant-share-access:", error);
    return res.status(500).json({ 
      error: "Server error",
      details: error.message 
    });
  }
}