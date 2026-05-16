'use strict';

// $guildInvites[separator?]
// Alias of $serverInvites — returns a separated list of active invite codes for the current guild.
module.exports = async (context, args) => {
  const sep = String(args[0] !== undefined ? args[0] : ', ');
  if (!context.message?.guild) return '[error: Not in a guild!]';
  try {
    const invites = await context.message.guild.invites.fetch();
    return [...invites.values()].map(inv => inv.code).join(sep);
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
