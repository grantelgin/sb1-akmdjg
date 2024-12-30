import React, { useEffect } from 'react';

// Extend Window interface to include the chat widget
declare global {
  interface Window {
    leadConnectorChatWidget?: any;
  }
}

export default function LeadConnectorChat() {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://widgets.leadconnectorhq.com/loader.js';
    script.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js');
    script.setAttribute('data-widget-id', '676d823a2d847501267eb656');
    script.async = true;

    // Add script to document
    document.body.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      document.body.removeChild(script);
      // Clean up any global variables or event listeners that the widget might have created
      if (window.leadConnectorChatWidget) {
        delete window.leadConnectorChatWidget;
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return null; // This component doesn't render anything visible
} 