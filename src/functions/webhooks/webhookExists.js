'use strict';

const { argError } = require('../../core/fnError');
// $webhookExists[webhookID]  — returns "true" if the webhook can be fetched
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const wh = await context.client?.fetchWebhook(id);
    return String(!!wh);
  } catch { return 'false'; }
};
