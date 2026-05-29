import { base44 } from "@/api/base44Client";

// Bot reply templates based on personality
const BOT_REPLIES = {
  flirty: [
    "Hmm dat klinkt geil 😈",
    "Ik word al nat als ik dat lees... 💦",
    "Vertel me meer, ik ben nieuwsgierig 😏",
    "Mmm je maakt me geil 🔥",
    "Wat zou je met me doen? 😘",
    "Ik denk dat we veel plezier kunnen hebben samen 💋",
    "Dat is precies wat ik wil horen 😍",
    "Je weet hoe je een meid moet prikkelen 🥵"
  ],
  naughty: [
    "Fuck, dat is heet 🔥",
    "Ik word zo geil van je woorden 😈",
    "Laten we stouter worden... 💦",
    "Mmm ja, zo mag ik het horen 👅",
    "Ik wil alles met je doen 🥵",
    "Vertel me je vuilste fantasie 😏",
    "Dat maakt me zo nat 💧",
    "Ik kan niet wachten om je te voelen 🔥"
  ],
  dominant: [
    "Brave. Precies zoals ik het wil.",
    "Je moet leren te gehoorzamen.",
    "Ik bepaal wat er gebeurt. Duidelijk?",
    "Goed zo. Blijf zo braaf.",
    "Je bent van mij. Vergeet dat niet.",
    "Doe wat ik zeg en je wordt beloond.",
    "Stil. Ik ben nog niet klaar met je.",
    "Op je knieën. Nu."
  ],
  submissive: [
    "Ja daddy... 🥺",
    "Alsjeblieft gebruik me... 😊",
    "Ik wil je gehoorzamen 🙈",
    "Wat wil je dat ik doe? 😇",
    "Ik ben helemaal van jou 💕",
    "Mag ik je pleasen? 🥺",
    "Ik doe alles wat je wilt 😊",
    "Train me alsjeblieft... 💜"
  ],
  playful: [
    "Haha je bent grappig! En geil 😄",
    "Oeh dat klinkt spannend! Vertel meer 😊",
    "Ik hou van je energie! 💫",
    "Laten we samen plezier maken 🎉",
    "Je maakt me nieuwsgierig 😁",
    "Dat wordt vast leuk! 😄",
    "Ik ben helemaal voor avontuur! 🚀",
    "Yes! Dat klinkt perfect 😃"
  ],
  direct: [
    "Recht voor z'n raap. Dat mag ik wel.",
    "Oké, wanneer kunnen we afspreken?",
    "Geen bullshit. Top.",
    "Zeg maar waar en wanneer.",
    "Laten we niet lullen maar neuken.",
    "Prima. Ben jij gescreend?",
    "Direct ter zake. Precies wat ik zoek.",
    "Goed. Stuur me je nummer."
  ]
};

const BOT_GREETINGS = [
  "Hey stranger, zin om te chatten? 🔥",
  "Ik zie je online... wat doe je nu? 😏",
  "Hoi! Je profiel ziet er interessant uit 😘",
  "Hey, ik vond je leuk. Zullen we kennismaken? 💋",
  "Hallo daar... verveeld? 😈",
  "Sup! Zin in een beetje fun? 🔥",
  "Hey cutie, wat ben je aan het doen? 😊",
  "Hoi! Ik was nieuwsgierig naar je... 💕"
];

export class BotService {
  constructor() {
    this.replyTimers = new Map();
    this.greetingTimers = new Map();
  }

  // Get random delay between min and max seconds
  getRandomDelay(minSeconds, maxSeconds) {
    return (Math.random() * (maxSeconds - minSeconds) + minSeconds) * 1000;
  }

  // Get random reply based on bot personality
  getRandomReply(personality) {
    const replies = BOT_REPLIES[personality] || BOT_REPLIES.flirty;
    return replies[Math.floor(Math.random() * replies.length)];
  }

  // Get random greeting
  getRandomGreeting() {
    return BOT_GREETINGS[Math.floor(Math.random() * BOT_GREETINGS.length)];
  }

  // Schedule bot reply to a user message
  async scheduleReply(botProfile, conversationId, receiverId) {
    // Cancel existing timer if any
    const timerKey = `${botProfile.id}_${conversationId}`;
    if (this.replyTimers.has(timerKey)) {
      clearTimeout(this.replyTimers.get(timerKey));
    }

    // Random delay: 10 seconds to 2 minutes
    const delay = this.getRandomDelay(10, 120);

    const timer = setTimeout(async () => {
      try {
        // Check if conversation still exists and bot hasn't replied yet
        const recentMessages = await base44.entities.ChatMessage.filter(
          { conversation_id: conversationId },
          '-created_date',
          5
        );

        // Don't reply if bot already sent last message
        if (recentMessages[0]?.sender_id === botProfile.id) {
          return;
        }

        // Send reply
        const reply = this.getRandomReply(botProfile.bot_personality);
        await base44.entities.ChatMessage.create({
          sender_id: botProfile.id,
          receiver_id: receiverId,
          conversation_id: conversationId,
          content: reply,
          message_type: "text",
          is_read: false,
          is_bot_message: true
        });

        // Update bot activity
        const activities = await base44.entities.BotActivity.filter({
          bot_profile_id: botProfile.id,
          target_profile_id: receiverId
        });
        
        if (activities.length > 0) {
          await base44.entities.BotActivity.update(activities[0].id, {
            last_reply_sent: new Date().toISOString()
          });
        }
      } catch (e) {
        console.error('Bot reply error:', e);
      }
      
      this.replyTimers.delete(timerKey);
    }, delay);

    this.replyTimers.set(timerKey, timer);
  }

  // Start proactive greeting to online users
  async startProactiveGreetings(botProfiles) {
    for (const bot of botProfiles) {
      if (!bot.is_online) continue;

      // Random interval: 5-15 minutes
      const interval = this.getRandomDelay(300, 900);

      const timer = setInterval(async () => {
        try {
          // Get online non-bot users
          const onlineUsers = await base44.entities.Profile.filter({ 
            is_online: true,
            is_bot: false 
          });

          if (onlineUsers.length === 0) return;

          // Pick random user
          const targetUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];

          // Check bot activity
          const activities = await base44.entities.BotActivity.filter({
            bot_profile_id: bot.id,
            target_profile_id: targetUser.id
          });

          // Don't spam - check last message time
          if (activities.length > 0) {
            const lastMsg = activities[0].last_message_sent;
            if (lastMsg) {
              const minutesSince = (Date.now() - new Date(lastMsg).getTime()) / 60000;
              if (minutesSince < 30) return; // Wait at least 30 minutes
            }
          }

          // Create conversation ID
          const convId = [bot.id, targetUser.id].sort().join('_');

          // Send greeting
          const greeting = this.getRandomGreeting();
          await base44.entities.ChatMessage.create({
            sender_id: bot.id,
            receiver_id: targetUser.id,
            conversation_id: convId,
            content: greeting,
            message_type: "text",
            is_read: false,
            is_bot_message: true
          });

          // Track activity
          if (activities.length > 0) {
            await base44.entities.BotActivity.update(activities[0].id, {
              last_message_sent: new Date().toISOString(),
              conversation_started: true
            });
          } else {
            await base44.entities.BotActivity.create({
              bot_profile_id: bot.id,
              target_profile_id: targetUser.id,
              last_message_sent: new Date().toISOString(),
              conversation_started: true
            });
          }
        } catch (e) {
          console.error('Bot greeting error:', e);
        }
      }, interval);

      this.greetingTimers.set(bot.id, timer);
    }
  }

  // Stop all timers
  cleanup() {
    this.replyTimers.forEach(timer => clearTimeout(timer));
    this.greetingTimers.forEach(timer => clearInterval(timer));
    this.replyTimers.clear();
    this.greetingTimers.clear();
  }
}

// Singleton instance
export const botService = new BotService();