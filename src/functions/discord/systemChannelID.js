'use strict';

// $systemChannelID
// Returns the ID of the guild's system messages channel, or empty string if not set.
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  return context.message.guild.systemChannelId ?? '';
};
