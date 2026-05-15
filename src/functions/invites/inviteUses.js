'use strict';

const { argError } = require('../../core/fnError');

// $inviteUses[code]
// Returns the number of times an invite has been used.
module.exports = async (context, args) => {
  const code = String(args[0] !== undefined ? args[0] : '').trim();
  if (!code) return argError(context, 'code', 'string', code);
  if (!context.client) return '[error: No client!]';

  try {
    const invite = await context.client.fetchInvite(code);
    return String(invite.uses ?? 0);
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
