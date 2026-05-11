'use strict';

// $emojiCount  — number of custom emojis in the server
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  return String(context.message.guild.emojis.cache.size);
};
