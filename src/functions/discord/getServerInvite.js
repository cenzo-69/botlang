'use strict';

// $getServerInvite[(guildID)]
// Returns the first active invite URL for the guild.
module.exports = async (context, args) => {
  const guildID = String(args[0] || '').trim();
  let guild = context.message?.guild;
  if (guildID) {
    try { guild = await context.client.guilds.fetch(guildID); } catch { return '[error: Guild not found!]'; }
  }
  if (!guild) return '[error: No guild!]';
  try {
    const invites = await guild.invites.fetch();
    const invite  = invites.first();
    return invite ? `https://discord.gg/${invite.code}` : '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
