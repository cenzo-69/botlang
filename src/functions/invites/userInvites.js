'use strict';

const { argError } = require('../../core/fnError');

// $userInvites[userID;separator?;format?]
// Returns a list of active invites created by the specified user in this guild.
//
// separator — string between entries (default: ", ")
// format    — "codes" (default), "urls", "count"
//   codes   → abc123, def456
//   urls    → https://discord.gg/abc123, https://discord.gg/def456
//   count   → 2
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  const sep    = args[1] !== undefined ? String(args[1]) : ', ';
  const format = String(args[2] !== undefined ? args[2] : 'codes').trim().toLowerCase();

  if (!userID) return argError(context, 'userID', 'string', userID);
  if (!context.message?.guild) return '[error: Not in a guild!]';

  try {
    const invites = await context.message.guild.invites.fetch();
    const matched = [...invites.values()].filter(inv => inv.inviter?.id === userID);

    if (format === 'count') return String(matched.length);

    const values = matched.map(inv =>
      format === 'urls' ? `https://discord.gg/${inv.code}` : inv.code
    );

    return values.join(sep);
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
