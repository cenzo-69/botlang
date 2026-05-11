'use strict';

// $botHasPerms[perm1;perm2;...]
// Returns "true" if the bot has ALL listed permissions in the current channel.
module.exports = async (context, args) => {
  const perms = args.map(p => String(p).trim()).filter(Boolean);

  if (!perms.length) return '[error: $botHasPerms requires at least one permission]';
  if (!context.client) return '[error: $botHasPerms — no client available]';

  try {
    const guild   = context.message?.guild;
    const channel = context.message?.channel;
    if (!guild || !channel) return '[error: $botHasPerms — not in a guild channel]';

    const botMember = guild.members.me;
    if (!botMember) return '[error: $botHasPerms — bot member not found]';

    const channelPerms = botMember.permissionsIn(channel);
    for (const perm of perms) {
      if (!channelPerms.has(perm)) return 'false';
    }
    return 'true';
  } catch (err) {
    return `[error: $botHasPerms — ${err.message}]`;
  }
};
