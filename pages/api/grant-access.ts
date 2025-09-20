// pages/api/grant-access.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prefix } = req.query;
  
  if (!prefix) {
    return res.status(400).json({ error: "Missing prefix parameter" });
  }

  try {
    // Call Lambda with ajax=true
    const lambdaUrl = `https://api.coolenglishmusic.com/grant?prefix=${prefix}&ajax=true`;
    
    const lambdaResponse = await fetch(lambdaUrl);
    const data = await lambdaResponse.json();

    if (!lambdaResponse.ok) {
      return res.status(lambdaResponse.status).json({ 
        error: "Lambda request failed",
        details: data 
      });
    }

    // Your Lambda returns this format (confirmed from your test):
    // { success: true, activityUrl: "...", cookies: {...} }
    
    if (data.success && data.cookies) {
      // Set CloudFront cookies with correct domain
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
    return res.status(500).json({ 
      error: "Server error",
      details: error.message 
    });
  }
}