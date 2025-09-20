// pages/check-sub.tsx
import { useState } from "react";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

export default function CheckSub() {
  const [info, setInfo] = useState<string>("");

  const checkMySubscription = async () => {
    try {
      setInfo("Checking...\n");
      
      // Get user info
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session?.tokens?.idToken?.toString();
      
      setInfo(prev => prev + `Your User ID: ${user.userId}\n`);
      setInfo(prev => prev + `Your Username: ${user.username}\n\n`);
      
      // Check subscription
      const response = await fetch('https://api.coolenglishmusic.com/check-subscription-status', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      const data = await response.json();
      setInfo(prev => prev + `Subscription Response:\n${JSON.stringify(data, null, 2)}\n\n`);
      
      // What the app thinks
      setInfo(prev => prev + `App thinks you're subscribed: ${data.isSubscribed ? 'YES' : 'NO'}\n`);
      
    } catch (error: any) {
      setInfo(prev => prev + `Error: ${error.message}\n`);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Subscription Check</h1>
      <button 
        onClick={checkMySubscription}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        Check My Subscription
      </button>
      <pre style={{ 
        backgroundColor: "#f0f0f0", 
        padding: "15px", 
        borderRadius: "5px",
        whiteSpace: "pre-wrap"
      }}>
        {info || "Click the button to check your subscription"}
      </pre>
    </div>
  );
}