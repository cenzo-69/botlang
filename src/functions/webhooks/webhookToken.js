'use strict';

const { argError } = require('../../core/fnError');
// $webhookToken[webhookID]  — returns the webhook token
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const wh = await context.client?.fetchWebhook(id);
    return wh?.token ?? '[error: $webhookToken — no token (bot-created webhooks may lack tokens)]';
  } catch (err) { return `[error: $webhookToken — ${err.message}]`; }
};
