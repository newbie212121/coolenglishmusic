// hooks/useDeviceTracking.ts
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.coolenglishmusic.com';

// Generate a simple device fingerprint
const generateDeviceFingerprint = (): string => {
  const components = [
    navigator.userAgent || 'unknown',
    navigator.language || 'en',
    navigator.platform || 'unknown',
    screen.width + 'x' + screen.height,
    screen.colorDepth || 24,
    new Date().getTimezoneOffset().toString(),
    navigator.hardwareConcurrency || 1,
    // Add canvas fingerprint for uniqueness
    getCanvasFingerprint()
  ];
  
  // Create a simple hash from components
  const fingerprint = components.join('|');
  return btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
};

// Canvas fingerprinting for additional uniqueness
const getCanvasFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('device-fingerprint-123', 2, 2);
    return canvas.toDataURL().slice(-50, -30); // Take a small unique portion
  } catch {
    return 'canvas-error';
  }
};

// Get or create device ID in localStorage
const getOrCreateDeviceId = (): string => {
  const stored = localStorage.getItem('device-id');
  if (stored) return stored;
  
  const newId = generateDeviceFingerprint();
  localStorage.setItem('device-id', newId);
  return newId;
};

// Get device name from user agent
const getDeviceName = (): string => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  
  let browser = 'Unknown Browser';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  let os = 'Unknown OS';
  if (platform.includes('Win')) os = 'Windows';
  else if (platform.includes('Mac')) os = 'Mac';
  else if (platform.includes('Linux')) os = 'Linux';
  else if (/Android|webOS|iPhone|iPad|iPod/.test(ua)) {
    if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    else os = 'Android';
  }
  
  return `${browser} on ${os}`;
};

export const useDeviceTracking = () => {
  const { isAuthenticated, getIdToken } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const trackDevice = async () => {
      try {
        const idToken = await getIdToken();
        if (!idToken) return;
        
        const deviceId = getOrCreateDeviceId();
        const deviceName = getDeviceName();
        
        // Send device info to backend
        const response = await fetch(`${API_BASE}/track-device`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            deviceId,
            deviceName,
            userAgent: navigator.userAgent,
            screen: `${screen.width}x${screen.height}`,
            platform: navigator.platform,
            timestamp: new Date().toISOString()
          })
        });
        
        // Silent tracking - no user notifications
        if (!response.ok) {
          console.error('Device tracking failed:', response.status);
        }
      } catch (error) {
        console.error('Error tracking device:', error);
      }
    };
    
    // Track device on mount
    trackDevice();
    
  }, [isAuthenticated, getIdToken]);
};