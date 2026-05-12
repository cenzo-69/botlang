'use strict';
// $roleUnicodeEmoji[guildID;roleID]  — returns the unicode emoji assigned to the role
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const roleID  = String(args[1] !== undefined ? args[1] : '').trim();
  if (!guildID || !roleID) return '[error: $roleUnicodeEmoji — guildID and roleID are required]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    const role  = guild?.roles.cache.get(roleID);
    if (!role) return '[error: $roleUnicodeEmoji — role not found]';
    return role.unicodeEmoji ?? '';
  } catch (err) { return `[error: $roleUnicodeEmoji — ${err.message}]`; }
};
