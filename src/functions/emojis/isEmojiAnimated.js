'use strict';

// $isEmojiAnimated[emojiID;guildID?]
// Returns "true" if the custom emoji is animated (GIF), else "false".
module.exports = async (context, args) => {
  const emojiID = args[0];
  const guildID = args[1];

  if (!emojiID) return 'false';
  if (!context.client) return 'false';

  try {
    const guild = guildID
      ? await context.client.guilds.fetch(guildID)
      : context.message?.guild;
    if (!guild) return 'false';

    const emoji = guild.emojis.cache.get(emojiID) || await guild.emojis.fetch(emojiID);
    if (!emoji) return 'false';

    return emoji.animated ? 'true' : 'false';
  } catch {
    return 'false';
  }
};
