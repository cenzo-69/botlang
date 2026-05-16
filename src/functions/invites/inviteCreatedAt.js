'use strict';

const { argError } = require('../../core/fnError');

// $inviteCreatedAt[code]
// Returns the creation timestamp (ISO string) of the invite.
module.exports = async (context, args) => {
  const code = String(args[0] !== undefined ? args[0] : '').trim();
  if (!code) return argError(context, 'code', 'string', code);
  if (!context.client) return '[error: No client!]';
  try {
    const invite = await context.client.fetchInvite(code);
    return invite.createdAt?.toISOString() ?? '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
