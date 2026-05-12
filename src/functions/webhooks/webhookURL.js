'use strict';
// $webhookURL[webhookID]  — returns the full webhook execute URL
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return '[error: $webhookURL — webhookID is required]';
  try {
    const wh = await context.client?.fetchWebhook(id);
    return wh?.url ?? '[error: $webhookURL — could not retrieve URL (missing token)]';
  } catch (err) { return `[error: $webhookURL — ${err.message}]`; }
};
