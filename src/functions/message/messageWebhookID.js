'use strict';
// $messageWebhookID  — returns webhook ID if message was sent by a webhook, else empty string
module.exports = async (context) => {
  return context.message?.webhookId ?? '';
};
