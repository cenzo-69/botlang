'use strict';

// $isMessageEdited[channelID;messageID]
// Returns "true" if the specified message has been edited, "false" otherwise.
module.exports = async (context, args) => {
  const channelID = String(args[0] || '').trim();
  const messageID = String(args[1] || '').trim();
  if (!channelID || !messageID) return '[error: $isMessageEdited requires channelID and messageID]';
  try {
    const channel = await context.client.channels.fetch(channelID);
    const msg     = await channel.messages.fetch(messageID);
    return String(msg.editedAt !== null);
  } catch (err) {
    return `[error: $isMessageEdited — ${err.message}]`;
  }
};
