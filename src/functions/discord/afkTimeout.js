'use strict';

// $afkTimeout
// Returns the guild's AFK timeout in seconds (0 if not set).
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  return String(context.message.guild.afkTimeout ?? 0);
};
