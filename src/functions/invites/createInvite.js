'use strict';

// $createInvite[channelID?;maxAge?;maxUses?;temporary?;reason?;unique?]
// Creates an invite for a channel and returns the full URL.
//
// channelID  — target channel ID (default: current channel)
// maxAge     — seconds until expiry, 0 = never expire (default: 86400 = 24h)
// maxUses    — max uses, 0 = unlimited (default: 0)
// temporary  — true/false, grants temporary membership (default: false)
// reason     — audit log reason (default: "Created via CenzoJS")
// unique     — true/false, force a unique invite instead of reusing one (default: true)
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  const maxAge    = args[1] !== undefined && args[1] !== '' ? parseInt(args[1]) : 86400;
  const maxUses   = args[2] !== undefined && args[2] !== '' ? parseInt(args[2]) : 0;
  const temporary = String(args[3] !== undefined ? args[3] : 'false').trim().toLowerCase() === 'true';
  const reason    = String(args[4] !== undefined ? args[4] : 'Created via CenzoJS').trim();
  const unique    = String(args[5] !== undefined ? args[5] : 'true').trim().toLowerCase() !== 'false';

  if (!context.client) return '[error: No client!]';

  try {
    const channel = channelID
      ? await context.client.channels.fetch(channelID)
      : context.message?.channel;

    if (!channel) return '[error: Channel not found!]';

    const invite = await channel.createInvite({ maxAge, maxUses, temporary, unique, reason });
    return invite.url;
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
