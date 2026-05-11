'use strict';

// $removeEmoji[emojiID;guildID?]
// Delete a custom emoji from the guild. Requires Manage Emojis permission.
module.exports = async (context, args) => {
  const emojiID = args[0];
  const guildID = args[1];

  if (!emojiID) return '[removeEmoji error: emojiID required]';
  if (!context.client) return '[removeEmoji error: no client]';

  try {
    const guild = guildID
      ? await context.client.guilds.fetch(guildID)
      : context.message?.guild;
    if (!guild) return '[removeEmoji error: guild not found]';

    const emoji = guild.emojis.cache.get(emojiID) || await guild.emojis.fetch(emojiID);
    if (!emoji) return '[removeEmoji error: emoji not found]';

    await emoji.delete();
    return '';
  } catch (err) {
    return `[removeEmoji error: ${err.message}]`;
  }
};
