'use strict';

// $customEmoji[name;guildID?]
// Returns the full emoji string (<:name:id> or <a:name:id>) for a custom emoji by name.
module.exports = async (context, args) => {
  const name    = args[0];
  const guildID = args[1];

  if (!name) return '[customEmoji error: name required]';
  if (!context.client) return '[customEmoji error: no client]';

  try {
    const guild = guildID
      ? await context.client.guilds.fetch(guildID)
      : context.message?.guild;
    if (!guild) return '[customEmoji error: guild not found]';

    const emoji = guild.emojis.cache.find(e => e.name.toLowerCase() === name.toLowerCase());
    if (!emoji) return '[customEmoji error: emoji not found]';

    return emoji.toString();
  } catch (err) {
    return `[customEmoji error: ${err.message}]`;
  }
};
