'use strict';
// $fetchMessage[channelID;messageID;property?]  — fetches and returns a property of a message
// property: id|content|authorID|createdAt|url|pinned|editedAt (default: id)
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  const messageID = String(args[1] !== undefined ? args[1] : '').trim();
  const property  = String(args[2] !== undefined ? args[2] : 'id').toLowerCase();
  if (!channelID || !messageID) return '[error: $fetchMessage — channelID and messageID are required]';
  try {
    const ch  = await context.client?.channels.fetch(channelID);
    if (!ch)  return '[error: $fetchMessage — channel not found]';
    const msg = await ch.messages.fetch(messageID);
    if (!msg) return '[error: $fetchMessage — message not found]';
    switch (property) {
      case 'content':    return msg.content ?? '';
      case 'authorid':   return msg.author?.id ?? '';
      case 'createdat':  return msg.createdAt?.toISOString() ?? '';
      case 'url':        return msg.url ?? '';
      case 'pinned':     return String(msg.pinned);
      case 'editedat':   return msg.editedAt?.toISOString() ?? '';
      case 'channelid':  return msg.channelId ?? '';
      case 'guildid':    return msg.guildId ?? '';
      default:           return msg.id;
    }
  } catch (err) { return `[error: $fetchMessage — ${err.message}]`; }
};
