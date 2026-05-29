import Pusher from 'pusher-js';

let pusherInstance = null;

export const getPusher = () => {
  if (!pusherInstance) {
    pusherInstance = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'eu',
      encrypted: true
    });
  }
  return pusherInstance;
};

export const subscribeToChatChannel = (conversationId, callback) => {
  const pusher = getPusher();
  const channel = pusher.subscribe(`chat-${conversationId}`);
  
  channel.bind('new-message', callback);
  
  return () => {
    channel.unbind('new-message', callback);
    pusher.unsubscribe(`chat-${conversationId}`);
  };
};

export const subscribeToTypingChannel = (conversationId, callback) => {
  const pusher = getPusher();
  const channel = pusher.subscribe(`typing-${conversationId}`);
  
  channel.bind('typing', callback);
  
  return () => {
    channel.unbind('typing', callback);
    pusher.unsubscribe(`typing-${conversationId}`);
  };
};

export const subscribeToNotifications = (profileId, callback) => {
  const pusher = getPusher();
  const channel = pusher.subscribe(`notifications-${profileId}`);
  
  channel.bind('notification', callback);
  
  return () => {
    channel.unbind('notification', callback);
    pusher.unsubscribe(`notifications-${profileId}`);
  };
};

export const triggerTyping = async (conversationId, profileId, isTyping) => {
  const pusher = getPusher();
  const channel = pusher.channel(`typing-${conversationId}`);
  if (channel) {
    channel.trigger('client-typing', { profileId, isTyping });
  }
};