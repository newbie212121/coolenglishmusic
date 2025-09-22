// pages/api/grant-access.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchAuthSession } from "aws-amplify/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prefix, activityId } = req.query;
  
  // Check if user is authenticated (optional - can remove if you want)
  try {
    const session = await fetchAuthSession();
    const idToken = session?.tokens?.idToken?.toString();
    
    // If no token, return error (optional check)
    if (!idToken) {
      return res.status(200).json({ 
        success: false,
        error: "authentication_required",
        message: "Please log in to access activities" 
      });
    }
  } catch (e) {
    // Session check failed - continue anyway
    console.log("Session check failed, continuing");
  }
  
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
    const lambdaResponse = await fetch(lambdaUrl);
    const data = await lambdaResponse.json();

    if (!lambdaResponse.ok) {
      return res.status(200).json({ 
        success: false,
        error: "access_denied",
        details: data 
      });
    }

    // Success - return activity URL
    if (data.success && data.cookies && Array.isArray(data.cookies)) {
      res.setHeader("Set-Cookie", data.cookies);
      return res.status(200).json({
        success: true,
        activityUrl: data.activityUrl,
      });
    }

    return res.status(200).json({ 
      success: false,
      error: "invalid_response",
      details: data
    });

  } catch (error: any) {
    console.error("Error in grant-access:", error);
    return res.status(200).json({ 
      success: false,
      error: "server_error",
      details: error.message 
    });
  }
}