// pages/test-subscription.tsx
import { useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

export default function TestSubscription() {
  const [results, setResults] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setResults("Starting tests...\n\n");

    try {
      // Test 1: Get Cognito token
      setResults(prev => prev + "1. Getting Cognito token... ");
      const session = await fetchAuthSession();
      const idToken = session?.tokens?.idToken?.toString();
      
      if (!idToken) {
        setResults(prev => prev + "❌ FAILED - Not logged in\n");
        return;
      }
      setResults(prev => prev + "✅ SUCCESS\n");

      // Test 2: Call API directly (bypass Next.js proxy)
      setResults(prev => prev + "2. Testing direct API call... ");
      const directResponse = await fetch('https://api.coolenglishmusic.com/check-subscription-status', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (!directResponse.ok) {
        setResults(prev => prev + `❌ FAILED - Status: ${directResponse.status}\n`);
        const errorText = await directResponse.text();
        setResults(prev => prev + `   Error: ${errorText}\n`);
      } else {
        const directData = await directResponse.json();
        setResults(prev => prev + `✅ SUCCESS\n`);
        setResults(prev => prev + `   Response: ${JSON.stringify(directData, null, 2)}\n`);
      }

      // Test 3: Call through Next.js proxy
      setResults(prev => prev + "\n3. Testing Next.js proxy... ");
      const proxyResponse = await fetch('/api/check-subscription', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      const proxyData = await proxyResponse.json();
      setResults(prev => prev + `✅ SUCCESS\n`);
      setResults(prev => prev + `   Response: ${JSON.stringify(proxyData, null, 2)}\n`);

      // Test 4: Activity access flow
      setResults(prev => prev + "\n4. Testing activity access... ");
      const grantResponse = await fetch('/api/grant-access?prefix=Full-Songs/Pop/Pure_WW/');
      const grantData = await grantResponse.json();
      
      if (grantData.success) {
        setResults(prev => prev + `✅ SUCCESS\n`);
        setResults(prev => prev + `   Activity URL: ${grantData.activityUrl}\n`);
      } else {
        setResults(prev => prev + `❌ FAILED\n`);
        setResults(prev => prev + `   Error: ${JSON.stringify(grantData)}\n`);
      }

    } catch (error: any) {
      setResults(prev => prev + `\n❌ ERROR: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Subscription System Test</h1>
      <button 
        onClick={runTests}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: loading ? "#888" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "default" : "pointer",
          marginBottom: "20px"
        }}
      >
        {loading ? "Testing..." : "Run All Tests"}
      </button>
      <pre style={{ 
        backgroundColor: "#f0f0f0", 
        padding: "15px", 
        borderRadius: "5px",
        whiteSpace: "pre-wrap",
        fontSize: "12px"
      }}>
        {results || "Click button to test subscription system"}
      </pre>
    </div>
  );
}