'use strict';

const { argError } = require('../../core/fnError');

// $inviteExpiresAt[code]
// Returns the expiry timestamp (ISO string) of the invite, or "never" if permanent.
module.exports = async (context, args) => {
  const code = String(args[0] !== undefined ? args[0] : '').trim();
  if (!code) return argError(context, 'code', 'string', code);
  if (!context.client) return '[error: No client!]';
  try {
    const invite = await context.client.fetchInvite(code);
    if (!invite.expiresAt) return 'never';
    return invite.expiresAt.toISOString();
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
