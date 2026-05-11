'use strict';

// $emojiExists[name;guildID?]
// Returns "true" if a custom emoji with the given name exists in the guild, else "false".
module.exports = async (context, args) => {
  const name    = args[0];
  const guildID = args[1];

  if (!name) return 'false';
  if (!context.client) return 'false';

  try {
    const guild = guildID
      ? await context.client.guilds.fetch(guildID)
      : context.message?.guild;
    if (!guild) return 'false';

    const found = guild.emojis.cache.some(e => e.name.toLowerCase() === name.toLowerCase());
    return found ? 'true' : 'false';
  } catch {
    return 'false';
  }
};
