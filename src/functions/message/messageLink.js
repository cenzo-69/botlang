'use strict';
// $messageLink[channelID?;messageID?]  — returns a jump URL for the message
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim() || context.message?.channelId;
  const messageID = String(args[1] !== undefined ? args[1] : '').trim() || context.message?.id;
  if (!channelID || !messageID) return '[error: ChannelID and messageID are required!]';
  try {
    const ch = await context.client?.channels.fetch(channelID);
    const guildId = ch?.guildId ?? context.message?.guildId;
    if (guildId) return `https://discord.com/channels/${guildId}/${channelID}/${messageID}`;
    return `https://discord.com/channels/@me/${channelID}/${messageID}`;
  } catch {
    return `https://discord.com/channels/0/${channelID}/${messageID}`;
  }
};
