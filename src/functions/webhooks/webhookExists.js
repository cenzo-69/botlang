'use strict';
// $webhookExists[webhookID]  — returns "true" if the webhook can be fetched
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return '[error: $webhookExists — webhookID is required]';
  try {
    const wh = await context.client?.fetchWebhook(id);
    return String(!!wh);
  } catch { return 'false'; }
};
