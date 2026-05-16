'use strict';

// $guildInvites[separator?;format?]
// Returns a list of all active invites in the current guild.
// Identical to $serverInvites with the same argument signature.
//
// separator — string between entries (default: ", ")
// format    — "codes" (default), "urls", "count", "detailed"
//   codes    → abc123, def456
//   urls     → https://discord.gg/abc123, https://discord.gg/def456
//   count    → 5
//   detailed → code (uses/maxUses, creator), ...
module.exports = async (context, args) => {
  const sep    = args[0] !== undefined ? String(args[0]) : ', ';
  const format = String(args[1] !== undefined ? args[1] : 'codes').trim().toLowerCase();

  if (!context.message?.guild) return '[error: Not in a guild!]';

  try {
    const invites = await context.message.guild.invites.fetch();
    const list    = [...invites.values()];

    if (format === 'count') return String(list.length);

    if (format === 'urls') {
      return list.map(inv => `https://discord.gg/${inv.code}`).join(sep);
    }

    if (format === 'detailed') {
      return list.map(inv => {
        const uses    = inv.uses ?? 0;
        const maxUses = inv.maxUses ?? 0;
        const creator = inv.inviter?.username ?? 'unknown';
        return `${inv.code} (${uses}/${maxUses === 0 ? '∞' : maxUses} uses, by ${creator})`;
      }).join(sep);
    }

    return list.map(inv => inv.code).join(sep);
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
