'use strict';
// $channelGuildID[channelID?]  — returns the guild ID of the channel
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const ch = id ? await context.client?.channels.fetch(id) : context.message?.channel;
    if (!ch) return '[error: Channel not found!]';
    return ch.guildId ?? ch.guild?.id ?? '';
  } catch (err) { return `[error: ${err.message}!]`; }
};
