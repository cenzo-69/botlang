'use strict';

const { argError } = require('../../core/fnError');

// $inviteMemberCount[code]
// Returns the approximate total member count of the guild the invite belongs to.
module.exports = async (context, args) => {
  const code = String(args[0] !== undefined ? args[0] : '').trim();
  if (!code) return argError(context, 'code', 'string', code);
  if (!context.client) return '[error: No client!]';
  try {
    const invite = await context.client.fetchInvite(code, { withCounts: true });
    return String(invite.memberCount ?? invite.guild?.memberCount ?? 0);
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
