// pages/api/grant-access.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prefix, activityId } = req.query;
  
  // Build the Lambda URL based on what was provided
  let lambdaUrl = "https://api.coolenglishmusic.com/grant?ajax=true";
  
  if (prefix) {
    lambdaUrl += `&prefix=${prefix}`;
  } else if (activityId) {
    lambdaUrl += `&activityId=${activityId}`;
  } else {
    return res.status(400).json({ error: "Missing prefix or activityId parameter" });
  }

  try {
    console.log("Calling Lambda:", lambdaUrl);
    
    const lambdaResponse = await fetch(lambdaUrl);
    const data = await lambdaResponse.json();

    if (!lambdaResponse.ok) {
      return res.status(lambdaResponse.status).json({ 
        error: "Lambda request failed",
        details: data 
      });
    }

    if (data.success && data.cookies) {
      // Set CloudFront cookies
      res.setHeader("Set-Cookie", [
        `CloudFront-Policy=${data.cookies['CloudFront-Policy']}; Domain=.coolenglishmusic.com; Path=/; Secure; HttpOnly; SameSite=None; Max-Age=86400`,
        `CloudFront-Signature=${data.cookies['CloudFront-Signature']}; Domain=.coolenglishmusic.com; Path=/; Secure; HttpOnly; SameSite=None; Max-Age=86400`,
        `CloudFront-Key-Pair-Id=${data.cookies['CloudFront-Key-Pair-Id']}; Domain=.coolenglishmusic.com; Path=/; Secure; HttpOnly; SameSite=None; Max-Age=86400`
      ]);

      return res.status(200).json({
        success: true,
        activityUrl: data.activityUrl,
      });
    }

    return res.status(500).json({ 
      error: "Invalid Lambda response format",
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