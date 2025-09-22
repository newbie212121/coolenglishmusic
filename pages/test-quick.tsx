// pages/test-quick.tsx
import { useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

export default function QuickTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDirectAPI = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Get token
      const session = await fetchAuthSession();
      const idToken = session?.tokens?.idToken?.toString();
      
      if (!idToken) {
        setResult({ error: "Not logged in. Please login first." });
        setLoading(false);
        return;
      }

      // Call API directly
      const response = await fetch('https://api.coolenglishmusic.com/members/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      setResult({
        status: response.status,
        ok: response.ok,
        data: data,
        isSubscribed: data.isSubscribed,
        message: data.isSubscribed ? "✅ User is SUBSCRIBED!" : "❌ User is NOT subscribed"
      });

    } catch (error: any) {
      setResult({ 
        error: error.message,
        type: error.name,
        note: error.message.includes('CORS') ? 'CORS ERROR - OPTIONS not working' : 'Other error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, -apple-system" }}>
      <h1>Quick Subscription Test</h1>
      
      <button 
        onClick={testDirectAPI}
        disabled={loading}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: loading ? "#ccc" : "#0066cc",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "default" : "pointer"
        }}
      >
        {loading ? "Testing..." : "Test /members/status"}
      </button>

      {result && (
        <div style={{ 
          marginTop: "20px",
          padding: "20px",
          backgroundColor: result.error ? "#fee" : "#efe",
          border: result.error ? "1px solid #fcc" : "1px solid #cfc",
          borderRadius: "8px"
        }}>
          <h3>{result.message || (result.error ? "Error" : "Success")}</h3>
          <pre style={{ 
            overflow: "auto",
            fontSize: "12px",
            lineHeight: "1.4"
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}