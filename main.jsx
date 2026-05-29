import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { base44 } from "./src/api/base44Client.js";
import { 
  MessageCircle, 
  Heart, 
  User, 
  Flame, 
  Home,
  Eye,
  Settings,
  Zap
} from "lucide-react";
import { useBotService } from "./src/components/bot/useBotService.jsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Splashscreen from "@/components/common/Splashscreen";

export default function Layout({ children, currentPageName }) {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [newMatches, setNewMatches] = useState(0);
  const [newVisitors, setNewVisitors] = useState(0);
  const [newLikes, setNewLikes] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [splashComplete, setSplashComplete] = useState(false);

  useBotService();

  // Show splash only on first mount
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('adultvibe_splash_seen');
    if (hasSeenSplash) {
      setShowSplash(false);
      setSplashComplete(true);
    }
  }, []);

  useEffect(() => {
    const profileId = localStorage.getItem('adultvibe_profile_id');
    if (profileId) {
      loadProfile(profileId);
      loadNotifications(profileId);
    }
  }, []);

  const loadProfile = async (profileId) => {
    const profiles = await base44.entities.Profile.filter({ id: profileId });
    if (profiles.length > 0) {
      setCurrentProfile(profiles[0]);
      await base44.entities.Profile.update(profileId, {
        is_online: true,
        last_active: new Date().toISOString()
      });
    }
  };

  const loadNotifications = async (profileId) => {
    try {
      const [messages, visits, receivedLikes] = await Promise.all([
        base44.entities.ChatMessage.filter({ receiver_id: profileId, is_read: false }),
        base44.entities.ProfileVisit.filter({ visited_id: profileId, is_seen: false }),
        base44.entities.Like.filter({ liked_id: profileId })
      ]);

      setUnreadMessages(messages.length);
      setNewVisitors(visits.length);

      // Count matches
      const matches = receivedLikes.filter(l => l.is_match);
      setNewMatches(matches.length);

      // Count unread likes (not matches)
      const unseenLikes = receivedLikes.filter(l => !l.is_match);
      setNewLikes(unseenLikes.length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  useEffect(() => {
    if (currentProfile) {
      const interval = setInterval(() => loadNotifications(currentProfile.id), 10000);
      return () => clearInterval(interval);
    }
  }, [currentProfile]);

  const isHomePage = currentPageName === "Home";
  const showNav = currentProfile && !isHomePage;

  const navItems = [
    { name: "Dashboard", icon: Home, page: "Dashboard", badge: 0 },
    { name: "Swipe", icon: Zap, page: "Swipe", badge: 0, iconColor: "text-cyan-400" },
    { name: "Berichten", icon: MessageCircle, page: "Conversations", badge: unreadMessages },
    { name: "Likes", icon: Heart, page: "Likes", badge: newLikes },
    { name: "Matches", icon: Flame, page: "Matches", badge: newMatches },
    { name: "Bezoekers", icon: Eye, page: "Visitors", badge: newVisitors },
    { name: "Profiel", icon: User, page: "Profile", badge: 0 },
  ];

  const handleSplashComplete = () => {
    sessionStorage.setItem('adultvibe_splash_seen', 'true');
    setSplashComplete(true);
  };

  if (showSplash && !splashComplete) {
    return <Splashscreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 overflow-hidden">
      <style>{`
        :root {
          --neon-pink: #ff2d92;
          --neon-purple: #a855f7;
          --neon-red: #ef4444;
          --dark-bg: #0a0a0f;
          --card-bg: rgba(20, 20, 30, 0.8);
        }
        
        .neon-glow {
          box-shadow: 0 0 25px rgba(236, 72, 153, 0.4), 0 0 50px rgba(139, 92, 246, 0.3);
        }
        
        .neon-text {
          text-shadow: 0 0 15px rgba(236, 72, 153, 0.6), 0 0 30px rgba(139, 92, 246, 0.4);
        }
        
        .glass-card {
          background: rgba(15, 15, 25, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(139, 92, 246, 0.3);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.1);
        }

        /* Enhanced Neon Buttons */
        button.neon-button {
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(139, 92, 246, 0.2);
          transition: all 0.3s ease;
        }

        button.neon-button:hover {
          box-shadow: 0 0 30px rgba(236, 72, 153, 0.6), 0 0 60px rgba(139, 92, 246, 0.4);
          transform: translateY(-2px);
        }

        /* Neon Borders */
        .neon-border {
          border: 2px solid rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.3), inset 0 0 10px rgba(139, 92, 246, 0.1);
        }

        .neon-border-pink {
          border: 2px solid rgba(236, 72, 153, 0.5);
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.3), inset 0 0 10px rgba(236, 72, 153, 0.1);
        }

        /* Custom Scrollbars */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 15, 25, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6));
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(139, 92, 246, 0.8), rgba(236, 72, 153, 0.8));
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.7);
        }

        /* Remove white overlays from buttons */
        button:hover {
          background-color: inherit !important;
        }

        button.neon-button:hover {
          transform: translateY(-2px);
        }

        /* WCAG CONTRAST FIXES - All text readable */
        body {
          color: #FFFFFF; /* Pure white base text */
        }
        
        /* Force high contrast text colors */
        .text-gray-100, .text-gray-200, .text-gray-300 {
          color: #E2E8F0 !important; /* Very light gray - readable on dark */
        }
        
        .text-gray-400 {
          color: #CBD5E1 !important; /* Light gray - still readable */
        }
        
        .text-gray-500 {
          color: #94A3B8 !important; /* Medium gray - WCAG AA+ */
        }

        .text-gray-600 {
          color: #64748B !important; /* Darker but still readable */
        }

        /* Ensure all text in glass cards is readable */
        .glass-card, .glass-card * {
          color: #FFFFFF;
        }

        .glass-card .text-gray-300,
        .glass-card .text-gray-400,
        .glass-card .text-gray-500 {
          color: #E2E8F0 !important;
        }

        /* Input fields - white text on dark */
        input, textarea, select {
          color: #FFFFFF !important;
        }

        input::placeholder, textarea::placeholder {
          color: #94A3B8 !important; /* WCAG compliant placeholder */
        }

        /* Buttons - ensure text is visible */
        button {
          color: #FFFFFF;
        }

        /* Links */
        a {
          color: #E2E8F0;
        }

        /* Safe area for mobile notches/nav */
        .safe-area-bottom {
          padding-bottom: max(env(safe-area-inset-bottom), 0.5rem);
        }

        /* Prevent layout shift during navigation */
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        .pulse-dot {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>

      {showNav && (
        <>
          {/* Fixed Top Header - Always visible */}
          <header className="flex-shrink-0 glass-card border-b border-purple-500/20 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
            <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2">
              <Flame className="w-7 h-7 text-pink-500" />
              <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent hidden sm:inline">
                AdultVibe
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.slice(0, 5).map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    currentPageName === item.page
                      ? "bg-purple-500/20 text-pink-400 neon-glow"
                      : "text-gray-300 hover:text-white hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${item.iconColor || ''}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold pulse-dot px-1">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full pulse-dot"></span>
                Online
              </div>
              <Link 
                to={createPageUrl("Profile")}
                className="text-gray-300 hover:text-white"
              >
                <User className="w-5 h-5" />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white text-xs hidden sm:inline-flex"
                onClick={() => {
                  if (confirm('Weet je zeker dat je wilt uitloggen?')) {
                    localStorage.removeItem('adultvibe_profile_id');
                    localStorage.removeItem('adultvibe_guest');
                    window.location.href = createPageUrl("Home");
                  }
                }}
              >
                Uitloggen
              </Button>
            </div>
          </header>
        </>
      )}

      {/* Scrollable Content */}
      <main className={`flex-1 overflow-y-auto ${!showNav ? "" : ""}`}>
        {children}
      </main>

      {showNav && (
        <>
          {/* Fixed Bottom Nav */}
          <nav className="flex-shrink-0 glass-card border-t border-purple-500/20 px-2 py-2 flex justify-around safe-area-bottom">
            {navItems.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg min-w-[60px] ${
                  currentPageName === item.page
                    ? "text-pink-400"
                    : "text-gray-400"
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.iconColor && currentPageName !== item.page ? item.iconColor : ''}`} />
                <span className="text-[9px] font-medium">{item.name}</span>
                {item.badge > 0 && (
                  <span className="absolute -top-0.5 right-0 min-w-[16px] h-[16px] bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold pulse-dot px-0.5">
                    {item.badge > 99 ? "99" : item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
