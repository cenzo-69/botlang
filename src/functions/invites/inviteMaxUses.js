'use strict';

const { argError } = require('../../core/fnError');

// $inviteMaxUses[code]
// Returns the maximum number of times the invite can be used (0 = unlimited).
module.exports = async (context, args) => {
  const code = String(args[0] !== undefined ? args[0] : '').trim();
  if (!code) return argError(context, 'code', 'string', code);
  if (!context.client) return '[error: No client!]';
  try {
    const invite = await context.client.fetchInvite(code);
    return String(invite.maxUses ?? 0);
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
