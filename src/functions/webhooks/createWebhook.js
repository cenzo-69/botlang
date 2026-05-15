'use strict';

const { argError } = require('../../core/fnError');

// $createWebhook[channelID;name;avatarURL?]
// Creates a webhook in the given channel and returns its ID and token
// as a JSON string: {"id":"...","token":"..."}
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  const name      = String(args[1] !== undefined ? args[1] : 'Webhook').trim();
  const avatar    = String(args[2] !== undefined ? args[2] : '').trim();

  if (!channelID) return argError(context, 'channel ID', 'TextChannel', channelID);
  if (!context.client) return '[error: No client available!]';

  try {
    const channel = await context.client.channels.fetch(channelID);
    if (!channel || !channel.createWebhook) return '[error: Channel not found or not a text channel!]';

    const options = { name };
    if (avatar) options.avatar = avatar;

    const wh = await channel.createWebhook(options);
    return JSON.stringify({ id: wh.id, token: wh.token });
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
