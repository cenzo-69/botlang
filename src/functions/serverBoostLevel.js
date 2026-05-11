'use strict';

// $serverBoostLevel  — server boost tier (0, 1, 2, or 3)
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  return String(context.message.guild.premiumTier ?? 0);
};
