'use strict';

const { argError } = require('../../core/fnError');

// $inviteExists[code]
// Returns "true" if the invite exists and is valid, "false" otherwise.
module.exports = async (context, args) => {
  const code = String(args[0] !== undefined ? args[0] : '').trim();
  if (!code) return argError(context, 'code', 'string', code);
  if (!context.client) return '[error: No client!]';
  try {
    await context.client.fetchInvite(code);
    return 'true';
  } catch {
    return 'false';
  }
};
