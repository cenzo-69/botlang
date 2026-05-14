'use strict';

const { argError } = require('../../core/fnError');

// $deleteInvite[code;reason?]
// Deletes an invite by its code.
module.exports = async (context, args) => {
  const code   = String(args[0] !== undefined ? args[0] : '').trim();
  const reason = String(args[1] !== undefined ? args[1] : '').trim() || 'No reason provided';

  if (!code) return argError(context, 'code', 'string', code);
  if (!context.client) return '[error: $deleteInvite — no client]';

  try {
    const invite = await context.client.fetchInvite(code);
    await invite.delete(reason);
    return '';
  } catch (err) {
    return `[error: $deleteInvite — ${err.message}]`;
  }
};
