'use strict';

// $emojiName[emojiID;guildID?]
// Returns the name of a custom emoji by its ID.
module.exports = async (context, args) => {
  const emojiID = args[0];
  const guildID = args[1];

  if (!emojiID) return '[emojiName error: emojiID required]';
  if (!context.client) return '[emojiName error: no client]';

  try {
    const guild = guildID
      ? await context.client.guilds.fetch(guildID)
      : context.message?.guild;
    if (!guild) return '[emojiName error: guild not found]';

    const emoji = guild.emojis.cache.get(emojiID) || await guild.emojis.fetch(emojiID);
    if (!emoji) return '[emojiName error: emoji not found]';

    return emoji.name;
  } catch (err) {
    return `[emojiName error: ${err.message}]`;
  }
};
