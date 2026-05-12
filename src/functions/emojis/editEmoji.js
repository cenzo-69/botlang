'use strict';
// $editEmoji[guildID;emojiID;name?;reason?;roles?]  — edits a guild emoji, returns "true"
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const emojiID = String(args[1] !== undefined ? args[1] : '').trim();
  const name    = args[2] !== undefined ? String(args[2]).trim() : undefined;
  const reason  = args[3] !== undefined ? String(args[3]) : undefined;
  const roles   = args[4] !== undefined ? String(args[4]).split(',').map(r => r.trim()) : undefined;
  if (!guildID || !emojiID) return '[error: $editEmoji — guildID and emojiID are required]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    const emoji = guild?.emojis.cache.get(emojiID);
    if (!emoji) return '[error: $editEmoji — emoji not found]';
    await emoji.edit({ name, reason, roles });
    return 'true';
  } catch (err) { return `[error: $editEmoji — ${err.message}]`; }
};
