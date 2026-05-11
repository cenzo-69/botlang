'use strict';

// $inviteUses[code]
// Returns the number of times an invite has been used.
module.exports = async (context, args) => {
  const code = String(args[0] !== undefined ? args[0] : '').trim();
  if (!code) return '[error: $inviteUses requires an invite code]';
  if (!context.client) return '[error: $inviteUses — no client]';

  try {
    const invite = await context.client.fetchInvite(code);
    return String(invite.uses ?? 0);
  } catch (err) {
    return `[error: $inviteUses — ${err.message}]`;
  }
};
