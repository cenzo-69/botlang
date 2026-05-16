'use strict';

const { argError } = require('../../core/fnError');

// $inviteGuildID[code]
// Returns the guild ID the invite belongs to.
module.exports = async (context, args) => {
  const code = String(args[0] !== undefined ? args[0] : '').trim();
  if (!code) return argError(context, 'code', 'string', code);
  if (!context.client) return '[error: No client!]';
  try {
    const invite = await context.client.fetchInvite(code);
    return invite.guild?.id ?? '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
