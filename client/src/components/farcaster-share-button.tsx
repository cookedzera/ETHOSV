import { useState, useEffect } from 'react';
import { Share, ExternalLink, Copy } from 'lucide-react';
import { SiFarcaster } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { sdk } from '@farcaster/miniapp-sdk';

interface FarcasterShareButtonProps {
  user: {
    displayName?: string;
    username?: string;
    score?: number;
    userkeys?: string[];
  };
  compact?: boolean;
}

export function FarcasterShareButton({ user, compact = false }: FarcasterShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkCapabilities, setSdkCapabilities] = useState<string[]>([]);
  
  const userkey = user?.userkeys?.[0] || '';
  const displayName = user?.displayName || user?.username || 'Anonymous';
  const score = user?.score || 0;
  
  // Generate frame URL
  const baseUrl = window.location.origin;
  const frameUrl = `${baseUrl}/farcaster/frame/${encodeURIComponent(userkey)}`;
  
  // Generate aesthetic cast text with engaging copy
  const castText = `✨ TRUST RADAR SCAN COMPLETE ✨

🎯 Score: ${score} | ${getScoreLevel(score)} ${getTierEmoji(score)}
📊 On-chain reputation verified via Ethos Network

Crafted by @cookedzera.eth on @ethos_network`;

  // Enhanced SDK detection and initialization
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Method 1: Check if SDK is available in window context
        if (typeof window !== 'undefined' && (window as any).farcaster) {
          setSdkReady(true);
        }
        
        // Method 2: Test SDK capabilities
        try {
          const capabilities = await sdk.getCapabilities();
          setSdkCapabilities(capabilities);
          setSdkReady(true);
        } catch (sdkError) {
          // SDK capabilities not available
        }
        
        // Method 3: Test context access
        try {
          const context = await sdk.context;
          if (context) {
            setSdkReady(true);
          }
        } catch (contextError) {
          // SDK context not available
        }
      } catch (error) {
        // SDK initialization failed
      }
    };
    
    initializeSDK();
  }, []);

  function getScoreLevel(score: number): string {
    if (score >= 2000) return 'Exemplary';
    if (score >= 1600) return 'Reputable';
    if (score >= 1200) return 'Neutral';
    if (score >= 800) return 'Questionable';
    return 'Untrusted';
  }

  function getTierEmoji(score: number): string {
    if (score >= 2000) return '👑'; // Exemplary (2000-2800)
    if (score >= 1600) return '🏆'; // Reputable (1600-1999)
    if (score >= 1200) return '⭐'; // Neutral (1200-1599) - Default tier
    if (score >= 800) return '🔥'; // Questionable (800-1199)
    return '⚡'; // Untrusted (0-799)
  }

  // Enhanced direct cast composition using Farcaster SDK
  const handleFlex = async () => {
    try {
      
      // Method 1: Try direct composeCast first (most reliable in Mini App)
      try {
        const result = await sdk.actions.composeCast({
          text: castText,
          embeds: [frameUrl],
          close: false // Don't close the app after casting
        });
        
        if (result?.cast) {
        }
        return;
      } catch (sdkError) {
      }
      
      // Method 2: Check if we're in Mini App context and use openUrl
      try {
        const context = await sdk.context;
        if (context) {
          const warpcastIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&embeds[]=${encodeURIComponent(frameUrl)}`;
          await sdk.actions.openUrl(warpcastIntentUrl);
          return;
        }
      } catch (contextError) {
      }
      
      // Method 3: Web browser fallback with intent URL
      const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&embeds[]=${encodeURIComponent(frameUrl)}`;
      
      // For mobile browsers, try location.href first as it's more reliable
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = warpcastUrl;
        return;
      }
      
      // For desktop, try window.open
      const newWindow = window.open(warpcastUrl, '_blank', 'noopener,noreferrer');
      
      if (!newWindow || newWindow.closed) {
        // Fallback to location.href if popup blocked
        window.location.href = warpcastUrl;
        return;
      }
      
      
    } catch (error) {
      // Final emergency fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(`${castText}\n\n${frameUrl}`);
        alert('Cast text copied to clipboard! Please paste in Warpcast to share.');
      } catch (clipError) {
        alert(`Please copy this text to share on Farcaster:\n\n${castText}\n\n${frameUrl}`);
      }
    }
  };

  const openWarpcast = async () => {
    await handleFlex(); // Use the same logic
  };

  const openFarcaster = () => {
    window.open(frameUrl, '_blank');
  };

  // Direct redirect function without popup
  const handleFlexClick = async () => {
    await openWarpcast();
  };

  const copyFrameUrl = async () => {
    try {
      await navigator.clipboard.writeText(frameUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Handle error silently in production
    }
  };

  if (compact) {
    return (
      <button
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await handleFlex();
        }}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg backdrop-blur-md bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:text-purple-200 transition-all duration-300 text-xs font-medium group ml-2"
      >
        <SiFarcaster className="w-3 h-3 transition-transform group-hover:scale-110" />
        <span>Flex</span>
      </button>
    );
  }

  return (
    <button 
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await handleFlex();
      }}
      className="px-3 py-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105"
    >
      <Share className="w-3.5 h-3.5" />
    </button>
  );
}