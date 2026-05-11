'use strict';

// $isInVC[userID?]
// Returns "true" if the user is currently in any voice channel, otherwise "false".
// Defaults to the message author.
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim()
    || context.message?.author?.id || '';

  if (!userID) return 'false';
  if (!context.message?.guild) return 'false';

  try {
    const member = await context.message.guild.members.fetch(userID).catch(() => null);
    return member?.voice?.channel ? 'true' : 'false';
  } catch {
    return 'false';
  }
};
