'use strict';

const { argError } = require('../../core/fnError');

const { WebhookClient } = require('discord.js');

// $webhookSend[webhookID;token;content;username?;avatarURL?]
// Sends a message via a webhook.
module.exports = async (context, args) => {
  const id        = String(args[0] !== undefined ? args[0] : '').trim();
  const token     = String(args[1] !== undefined ? args[1] : '').trim();
  const content   = String(args[2] !== undefined ? args[2] : '');
  const username  = String(args[3] !== undefined ? args[3] : '').trim();
  const avatarURL = String(args[4] !== undefined ? args[4] : '').trim();

  if (!id || !token) return argError(context, 'id', 'string', id);
  if (!content)      return argError(context, 'content', 'string', content);

  try {
    const wh      = new WebhookClient({ id, token });
    const payload = { content };
    if (username)  payload.username  = username;
    if (avatarURL) payload.avatarURL = avatarURL;
    await wh.send(payload);
    wh.destroy();
    return '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
