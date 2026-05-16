'use strict';

const { argError } = require('../../core/fnError');

// $inviteCreator[code;format?]
// Returns information about the user who created the invite.
//
// format options:
//   username (default) — plain username
//   tag                — username (no discriminator in new Discord, same as username)
//   id                 — user ID
//   mention            — <@userID>
//   avatar             — avatar URL
module.exports = async (context, args) => {
  const code   = String(args[0] !== undefined ? args[0] : '').trim();
  const format = String(args[1] !== undefined ? args[1] : 'username').trim().toLowerCase();

  if (!code) return argError(context, 'code', 'string', code);
  if (!context.client) return '[error: No client!]';

  try {
    const invite  = await context.client.fetchInvite(code);
    const inviter = invite.inviter;
    if (!inviter) return '[unknown]';

    switch (format) {
      case 'id':      return inviter.id;
      case 'mention': return `<@${inviter.id}>`;
      case 'avatar':  return inviter.displayAvatarURL({ size: 512 });
      case 'tag':     return inviter.tag ?? inviter.username;
      default:        return inviter.username;
    }
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
