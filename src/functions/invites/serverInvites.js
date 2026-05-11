'use strict';

// $serverInvites[separator?]
// Returns a separated list of active invite codes for the current server.
module.exports = async (context, args) => {
  const sep = String(args[0] !== undefined ? args[0] : ', ');
  if (!context.message?.guild) return '[error: $serverInvites — not in a guild]';

  try {
    const invites = await context.message.guild.invites.fetch();
    return [...invites.values()].map(inv => inv.code).join(sep);
  } catch (err) {
    return `[error: $serverInvites — ${err.message}]`;
  }
};
