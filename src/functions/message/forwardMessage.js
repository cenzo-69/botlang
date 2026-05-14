'use strict';

const { argError } = require('../../core/fnError');
// $forwardMessage[targetChannelID;channelID?;messageID?]  — forwards a message to another channel
module.exports = async (context, args) => {
  const targetID  = String(args[0] !== undefined ? args[0] : '').trim();
  const channelID = String(args[1] !== undefined ? args[1] : '').trim() || context.message?.channelId;
  const messageID = String(args[2] !== undefined ? args[2] : '').trim() || context.message?.id;
  if (!targetID)  return argError(context, 'channel ID', 'TextChannel', channelID);
  if (!channelID || !messageID) return '[error: $forwardMessage — could not resolve source channel/message]';
  try {
    const srcCh = await context.client?.channels.fetch(channelID);
    const msg   = await srcCh?.messages.fetch(messageID);
    if (!msg)   return '[error: $forwardMessage — source message not found]';
    const dstCh = await context.client?.channels.fetch(targetID);
    if (!dstCh) return '[error: $forwardMessage — target channel not found]';
    const sent = await dstCh.send({
      content: msg.content || undefined,
      embeds:  msg.embeds,
      files:   [...msg.attachments.values()].map(a => a.url),
    });
    return sent.id;
  } catch (err) { return `[error: $forwardMessage — ${err.message}]`; }
};
