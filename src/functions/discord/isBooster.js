'use strict';

const { resolveMember } = require('../../core/resolveUser');

// $isBooster[userID?;guildID?]
// Returns "true" if the member is boosting the server.
module.exports = async (context, args) => {
  const userID  = String(args[0] !== undefined ? args[0] : '').trim();
  const guildID = String(args[1] !== undefined ? args[1] : '').trim();

  let guild = context.message?.guild;
  if (guildID && context.client) {
    try { guild = await context.client.guilds.fetch(guildID); } catch { return 'false'; }
  }
  if (!guild) return 'false';

  try {
    const member = await guild.members.fetch(userID || context.message?.author?.id).catch(() => null);
    if (!member) return 'false';
    return member.premiumSince ? 'true' : 'false';
  } catch {
    return 'false';
  }
};
