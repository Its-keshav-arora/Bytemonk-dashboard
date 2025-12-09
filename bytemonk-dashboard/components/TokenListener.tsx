'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function TokenListener() {
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    const sendTokenToMCP = async () => {
      if (!isSignedIn) return;

      const token = await getToken();
      if (!token) return;

      // Get role from localStorage (set by SignIn/SignUp pages)
      const role = typeof window !== 'undefined' ? (localStorage.getItem('userRole') || 'human') : 'human';

      try {
        await fetch('http://127.0.0.1:8765/set-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, role }),
        });

        console.log(`✔ Token sent to MCP server (role: ${role})`);
      } catch (err) {
        console.error('✖ Failed to send token to MCP:', err);
      }
    };

    sendTokenToMCP();
  }, [isSignedIn, getToken]);

  return null;
}
