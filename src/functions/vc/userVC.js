'use strict';

// $userVC[userID?]
// Returns the ID of the voice channel the user is currently in.
// Defaults to the message author.
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim()
    || context.message?.author?.id || '';

  if (!userID) return '';
  if (!context.message?.guild) return '';

  try {
    const member = await context.message.guild.members.fetch(userID).catch(() => null);
    return member?.voice?.channel?.id ?? '';
  } catch {
    return '';
  }
};
