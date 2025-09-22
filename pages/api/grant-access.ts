// pages/api/grant-access.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prefix, activityId } = req.query;
  
  // Build the Lambda URL
  let lambdaUrl = "https://api.coolenglishmusic.com/grant?ajax=true";
  
  if (prefix) {
    lambdaUrl += `&prefix=${encodeURIComponent(prefix as string)}`;
  } else if (activityId) {
    lambdaUrl += `&activityId=${encodeURIComponent(activityId as string)}`;
  } else {
    return res.status(400).json({ error: "Missing prefix or activityId parameter" });
  }

  try {
    console.log("Calling Lambda:", lambdaUrl);
    
    const lambdaResponse = await fetch(lambdaUrl);
    const data = await lambdaResponse.json();
    
    console.log("Lambda response:", data);

    if (!lambdaResponse.ok) {
      return res.status(lambdaResponse.status).json({ 
        error: "Lambda request failed",
        details: data 
      });
    }

    // The Lambda returns cookies as an ARRAY when ajax=true
    if (data.success && data.cookies && Array.isArray(data.cookies)) {
      // Set the cookies
      res.setHeader("Set-Cookie", data.cookies);

      return res.status(200).json({
        success: true,
        activityUrl: data.activityUrl,
      });
    }

    // Handle other success cases (might not have cookies)
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