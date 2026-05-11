'use strict';

// $botAvatar  — the bot's avatar URL
module.exports = async (context, args) => {
  if (!context.client?.user) return '[error: bot not ready]';
  return context.client.user.displayAvatarURL({ size: 1024 });
};
