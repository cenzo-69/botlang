'use strict';

const { argError } = require('../../core/fnError');

// $userInvites[userID;separator?]
// Returns a list of active invite codes created by the specified user in this guild.
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  const sep    = args[1] !== undefined ? String(args[1]) : ', ';

  if (!userID) return argError(context, 'userID', 'string', userID);
  if (!context.message?.guild) return '[error: Not in a guild!]';

  try {
    const invites = await context.message.guild.invites.fetch();
    const codes   = [...invites.values()]
      .filter(inv => inv.inviter?.id === userID)
      .map(inv => inv.code);
    return codes.join(sep);
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
