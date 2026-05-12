'use strict';
// $findMember[guildID;query;returnAuthor?]  — finds a guild member by name, nickname, or ID
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const query   = String(args[1] !== undefined ? args[1] : '').trim();
  const ret     = String(args[2] !== undefined ? args[2] : 'id').toLowerCase();
  if (!guildID || !query) return '[error: $findMember — guildID and query are required]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    if (!guild) return '[error: $findMember — guild not found]';
    await guild.members.fetch();
    const q = query.toLowerCase();
    const member = guild.members.cache.find(m =>
      m.id === query ||
      m.user.username.toLowerCase().includes(q) ||
      m.displayName.toLowerCase().includes(q) ||
      m.user.globalName?.toLowerCase().includes(q)
    );
    if (!member) return '';
    switch (ret) {
      case 'username':    return member.user.username;
      case 'displayname': return member.displayName;
      case 'tag':         return member.user.tag;
      default:            return member.id;
    }
  } catch (err) { return `[error: $findMember — ${err.message}]`; }
};
