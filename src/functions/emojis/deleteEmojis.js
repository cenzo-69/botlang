'use strict';

const { argError } = require('../../core/fnError');
// $deleteEmojis[guildID;emojiID1;emojiID2;...]  — deletes emojis and returns count deleted
module.exports = async (context, args) => {
  const guildID  = String(args[0] !== undefined ? args[0] : '').trim();
  const emojiIDs = args.slice(1).map(a => String(a).trim()).filter(Boolean);
  if (!guildID) return argError(context, 'guild ID', 'Snowflake', guildID);
  if (!emojiIDs.length) return '[error: At least one emojiID is required!]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    if (!guild) return '[error: Guild not found!]';
    let count = 0;
    for (const id of emojiIDs) {
      const emoji = guild.emojis.cache.get(id);
      if (emoji) { await emoji.delete(); count++; }
    }
    return String(count);
  } catch (err) { return `[error: ${err.message}!]`; }
};
