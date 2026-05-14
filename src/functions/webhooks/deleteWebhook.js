'use strict';

const { argError } = require('../../core/fnError');

const { WebhookClient } = require('discord.js');

// $deleteWebhook[webhookID;token]
// Deletes a webhook by ID and token.
module.exports = async (context, args) => {
  const id    = String(args[0] !== undefined ? args[0] : '').trim();
  const token = String(args[1] !== undefined ? args[1] : '').trim();

  if (!id || !token) return argError(context, 'id', 'string', id);

  try {
    const wh = new WebhookClient({ id, token });
    await wh.delete();
    wh.destroy();
    return '';
  } catch (err) {
    return `[error: $deleteWebhook — ${err.message}]`;
  }
};
