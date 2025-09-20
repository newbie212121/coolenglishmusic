// pages/test-grant.tsx
"use client";

import { useState } from "react";

export default function TestGrant() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const grantAccess = async () => {
    setLoading(true);
    setMsg("Starting...");
    
    try {
      // Skip authentication check for now - just test the grant mechanism
      setMsg("Requesting access to activity...");
      
      const response = await fetch("/api/grant-access?prefix=Pure_WW/", {
        method: "GET",
        credentials: "include", // Important for cookies
      });

      setMsg(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      
      if (data.success && data.activityUrl) {
        setMsg("✓ Access granted! Opening activity in 3 seconds...");
        
        // Wait a bit to see the success message
        setTimeout(() => {
          window.open(data.activityUrl, '_blank');
          setMsg("✓ Activity opened! Check the new tab.");
        }, 3000);
      } else {
        throw new Error("No activity URL in response");
      }

    } catch (error: any) {
      console.error("Error:", error);
      setMsg(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirect = () => {
    setMsg("Opening activity directly to test if cookies are set...");
    window.open("https://activities.coolenglishmusic.com/Pure_WW/index.html", '_blank');
  };

  const checkCookies = () => {
    const cookies = document.cookie;
    const cfCookies = cookies.split(';')
      .filter(c => c.trim().startsWith('CloudFront-'))
      .map(c => c.trim().split('=')[0]);
    
    if (cfCookies.length > 0) {
      setMsg(`✓ Found CloudFront cookies:\n${cfCookies.join('\n')}`);
    } else {
      setMsg("❌ No CloudFront cookies found");
    }
  };

  const testLambdaDirectly = async () => {
    setMsg("Testing Lambda directly...");
    try {
      const response = await fetch("https://api.coolenglishmusic.com/grant?prefix=Pure_WW/&ajax=true");
      const data = await response.json();
      setMsg(`Lambda response:\n${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setMsg(`Error calling Lambda: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h1>Test Grant Access (No Auth Required)</h1>
      
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <button 
          onClick={grantAccess}
          disabled={loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: loading ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Working..." : "1. Grant Access via API Route"}
        </button>

        <button 
          onClick={testDirect}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          2. Test Direct Access
        </button>

        <button 
          onClick={checkCookies}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Check Cookies
        </button>

        <button 
          onClick={testLambdaDirectly}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#9C27B0",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Test Lambda Directly
        </button>
      </div>

      <div style={{
        padding: "15px",
        backgroundColor: "#f5f5f5",
        borderRadius: "4px",
        minHeight: "100px",
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        fontSize: "14px"
      }}>
        {msg || "Click a button to test..."}
      </div>

      <div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#e3f2fd", borderRadius: "4px" }}>
        <h3 style={{ margin: "0 0 10px 0" }}>Instructions:</h3>
        <ol style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>Click "Grant Access via API Route" - this should set CloudFront cookies</li>
          <li>After it opens the activity, check if it loads or shows "Access Denied"</li>
          <li>Click "Check Cookies" to verify cookies were set</li>
          <li>Click "Test Direct Access" to test if cookies are working</li>
        </ol>
      </div>
    </div>
  );
}