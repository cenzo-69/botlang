'use strict';

// $mute[userID;durationMs;reason?]
// Times out (mutes) a member. Alias for $timeout using Discord's timeout API.
// durationMs: duration in milliseconds (max 28 days = 2419200000).
module.exports = async (context, args) => {
  const userID   = String(args[0] !== undefined ? args[0] : '').trim();
  const duration = parseInt(args[1]);
  const reason   = String(args[2] !== undefined ? args[2] : '').trim() || 'No reason provided';

  if (!userID)      return '[error: $mute requires a userID]';
  if (isNaN(duration) || duration < 1) return '[error: $mute requires a valid duration in ms]';
  if (!context.message?.guild) return '[error: $mute — not in a guild]';

  try {
    const member = await context.message.guild.members.fetch(userID).catch(() => null);
    if (!member) return '[error: $mute — member not found]';
    await member.timeout(duration, reason);
    return '';
  } catch (err) {
    return `[error: $mute — ${err.message}]`;
  }
};
