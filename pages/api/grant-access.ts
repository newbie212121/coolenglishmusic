// pages/api/grant-access.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prefix, activityId } = req.query;
  const authHeader = req.headers.authorization;
  
  let lambdaUrl = "https://api.coolenglishmusic.com/grant?ajax=true";
  
  if (prefix) {
    lambdaUrl += `&prefix=${encodeURIComponent(prefix as string)}`;
  } else if (activityId) {
    lambdaUrl += `&activityId=${encodeURIComponent(activityId as string)}`;
  } else {
    return res.status(400).json({ error: "Missing prefix or activityId parameter" });
  }

  try {
    // CRITICAL: Pass the Authorization header to Lambda
    const headers: any = {
      "Content-Type": "application/json"
    };
    
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    
    const lambdaResponse = await fetch(lambdaUrl, { headers });
    const data = await lambdaResponse.json();

    // Handle different response codes
    if (lambdaResponse.status === 401) {
      // Not authenticated
      return res.status(200).json({ 
        success: false,
        error: "authentication_required",
        message: data.message || "Please log in to access this activity"
      });
    }
    
    if (lambdaResponse.status === 403) {
      // Not subscribed
      return res.status(200).json({ 
        success: false,
        error: "subscription_required",
        message: data.message || "Premium subscription required"
      });
    }

    if (!lambdaResponse.ok) {
      return res.status(lambdaResponse.status).json({ 
        error: "Lambda request failed",
        details: data 
      });
    }

    // Success - fix cookies and return
    if (data.success && data.cookies && Array.isArray(data.cookies)) {
      // Fix empty domain in cookies
      const fixedCookies = data.cookies.map(cookie => {
        if (cookie.includes('Domain=;')) {
          return cookie.replace('Domain=;', 'Domain=.coolenglishmusic.com;');
        }
        return cookie;
      });
      
      res.setHeader("Set-Cookie", fixedCookies);

      return res.status(200).json({
        success: true,
        activityUrl: data.activityUrl,
      });
    }

    if (data.activityUrl) {
      return res.status(200).json({
        success: true,
        activityUrl: data.activityUrl,
      });
    }

    return res.status(500).json({ 
      error: "Invalid Lambda response",
      details: data
    });

  } catch (error: any) {
    console.error("Error in grant-access:", error);
    return res.status(500).json({ 
      error: "Server error",
      details: error.message 
    });
  }
}