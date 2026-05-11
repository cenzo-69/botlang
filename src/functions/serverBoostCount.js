'use strict';

// $serverBoostCount  — number of active server boosts
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  return String(context.message.guild.premiumSubscriptionCount ?? 0);
};
