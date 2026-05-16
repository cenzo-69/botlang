'use strict';

const { argError } = require('../../core/fnError');

// $isInviteTemporary[code]
// Alias of $inviteTemporary — returns "true" or "false".
module.exports = async (context, args) => {
  const code = String(args[0] !== undefined ? args[0] : '').trim();
  if (!code) return argError(context, 'code', 'string', code);
  if (!context.client) return '[error: No client!]';
  try {
    const invite = await context.client.fetchInvite(code);
    return String(invite.temporary ?? false);
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
