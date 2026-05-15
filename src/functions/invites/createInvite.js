'use strict';

// $createInvite[channelID?;maxAge?;maxUses?;temporary?]
// Creates an invite link for the channel.
// maxAge in seconds (0 = permanent). Returns the full invite URL.
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  const maxAge    = parseInt(args[1]) || 86400;
  const maxUses   = parseInt(args[2]) || 0;
  const temporary = String(args[3] !== undefined ? args[3] : '').trim().toLowerCase() === 'true';

  if (!context.client) return '[error: No client!]';

  try {
    const channel = channelID
      ? await context.client.channels.fetch(channelID)
      : context.message?.channel;

    if (!channel) return '[error: Channel not found!]';

    const invite = await channel.createInvite({ maxAge, maxUses, temporary, unique: true });
    return invite.url;
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
