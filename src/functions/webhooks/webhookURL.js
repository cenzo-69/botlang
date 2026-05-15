'use strict';

const { argError } = require('../../core/fnError');
// $webhookURL[webhookID]  — returns the full webhook execute URL
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const wh = await context.client?.fetchWebhook(id);
    return wh?.url ?? '[error: Could not retrieve URL (missing token)!]';
  } catch (err) { return `[error: ${err.message}!]`; }
};
