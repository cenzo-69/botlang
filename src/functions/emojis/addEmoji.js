'use strict';

// $addEmoji[name;imageURL;guildID?]
// Add a custom emoji to the guild. Requires Manage Emojis permission.
// imageURL: a direct URL to the image (PNG, JPG, GIF).
module.exports = async (context, args) => {
  const name     = args[0];
  const imageURL = args[1];
  const guildID  = args[2];

  if (!name || !imageURL) return '[addEmoji error: name and imageURL required]';
  if (!context.client) return '[addEmoji error: no client]';

  try {
    const guild = guildID
      ? await context.client.guilds.fetch(guildID)
      : context.message?.guild;
    if (!guild) return '[addEmoji error: guild not found]';

    const emoji = await guild.emojis.create({ name, attachment: imageURL });
    return emoji.toString();
  } catch (err) {
    return `[addEmoji error: ${err.message}]`;
  }
};
