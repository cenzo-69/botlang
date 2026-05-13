'use strict';

const fnError = require('../../core/fnError');

// $purge[amount;countVar?]
// Bulk-deletes messages in the current channel (max 100 per call, last 14 days).
// Returns '' to prevent output leaking into the bot response.
// If countVar is provided, stores the number deleted in that session variable.
module.exports = async (context, args) => {
  const channel = context.message?.channel ?? context.interaction?.channel;
  if (!channel) {
    return fnError('purge', 'channel context is required');
  }

  const raw    = String(args[0] !== undefined ? args[0] : '').trim();
  const amount = parseInt(raw);
  if (isNaN(amount) || amount < 1) {
    return fnError('purge', 'amount must be a positive integer', {
      got:      raw || '(empty)',
      expected: 'a number between 1 and 100',
      example:  '$purge[10]',
    });
  }

  const clamped  = Math.min(100, Math.max(1, amount));
  const countVar = args[1] !== undefined ? String(args[1]).trim() : '';

  try {
    const messages = await channel.messages.fetch({ limit: clamped });
    const deleted  = await channel.bulkDelete(messages, true); // filter msgs > 14d old
    if (countVar) context.variables.set(countVar.toLowerCase(), String(deleted.size));
    return ''; // ← never leak the count into message output
  } catch (err) {
    return fnError('purge', err.message, {
      tip:     'Bot needs "Manage Messages" permission. Only messages < 14 days old can be bulk-deleted.',
      example: '$purge[10]',
    });
  }
};
