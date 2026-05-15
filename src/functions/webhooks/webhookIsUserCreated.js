'use strict';

const { argError } = require('../../core/fnError');
// $webhookIsUserCreated[webhookID]  — "true" if webhook was created by a user (not a bot/integration)
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const wh = await context.client?.fetchWebhook(id);
    return String(wh?.type === 1 && !wh?.applicationId);
  } catch (err) { return `[error: ${err.message}!]`; }
};
