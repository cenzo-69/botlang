'use strict';
// $channelURL[channelID?]  — returns the Discord URL for the channel
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const ch = id ? await context.client?.channels.fetch(id) : context.message?.channel;
    if (!ch) return '[error: $channelURL — channel not found]';
    const guildId = ch.guildId ?? ch.guild?.id;
    return guildId ? `https://discord.com/channels/${guildId}/${ch.id}` : `https://discord.com/channels/@me/${ch.id}`;
  } catch (err) { return `[error: $channelURL — ${err.message}]`; }
};
