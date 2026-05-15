'use strict';

const { argError } = require('../../core/fnError');

// $getMessage[channelID;messageID;(type)]
// Fetches a message. type: content (default) | author | authorID | timestamp
module.exports = async (context, args) => {
  const channelID = String(args[0] || '').trim();
  const messageID = String(args[1] || '').trim();
  const type      = String(args[2] || 'content').trim().toLowerCase();
  if (!channelID || !messageID) return argError(context, 'channel ID', 'TextChannel', channelID);
  try {
    const channel = await context.client.channels.fetch(channelID);
    const msg     = await channel.messages.fetch(messageID);
    switch (type) {
      case 'author':    return msg.author?.username ?? '';
      case 'authorid':  return msg.author?.id ?? '';
      case 'timestamp': return msg.createdAt.toISOString();
      default:          return msg.content ?? '';
    }
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
