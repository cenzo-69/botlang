'use strict';

// $emoteCount[guildID?]
// Returns the number of custom emojis in the guild (alias for $emojiCount).
module.exports = async (context, args) => {
  const guildID = args[0];
  if (!context.client) return '[emoteCount error: no client]';

  try {
    const guild = guildID
      ? await context.client.guilds.fetch(guildID)
      : context.message?.guild;
    if (!guild) return '[emoteCount error: guild not found]';

    return String(guild.emojis.cache.size);
  } catch (err) {
    return `[emoteCount error: ${err.message}]`;
  }
};
