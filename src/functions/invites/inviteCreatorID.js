'use strict';

const { argError } = require('../../core/fnError');

// $inviteCreatorID[code]
// Returns the user ID of the user who created the invite.
module.exports = async (context, args) => {
  const code = String(args[0] !== undefined ? args[0] : '').trim();
  if (!code) return argError(context, 'code', 'string', code);
  if (!context.client) return '[error: No client!]';
  try {
    const invite = await context.client.fetchInvite(code);
    return invite.inviter?.id ?? '[unknown]';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
