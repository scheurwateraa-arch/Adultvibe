import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { botService } from './BotService';

export function useBotService() {
  useEffect(() => {
    let mounted = true;

    const initBots = async () => {
      try {
        // Get all bot profiles
        const bots = await base44.entities.Profile.filter({ is_bot: true });
        
        if (mounted) {
          // Start proactive greetings
          botService.startProactiveGreetings(bots);
        }
      } catch (e) {
        console.error('Failed to init bots:', e);
      }
    };

    initBots();

    return () => {
      mounted = false;
      botService.cleanup();
    };
  }, []);
}

// Hook for handling bot replies in chat
export function useBotReply(otherProfile, conversationId, currentProfile) {
  useEffect(() => {
    if (!otherProfile?.is_bot || !conversationId || !currentProfile) return;

    // Subscribe to new messages in this conversation
    const unsubscribe = base44.entities.ChatMessage.subscribe((event) => {
      if (event.type === 'create' && 
          event.data.conversation_id === conversationId &&
          event.data.sender_id === currentProfile.id &&
          !event.data.is_bot_message) {
        
        // User sent message, schedule bot reply
        botService.scheduleReply(otherProfile, conversationId, currentProfile.id);
      }
    });

    return unsubscribe;
  }, [otherProfile, conversationId, currentProfile]);
}