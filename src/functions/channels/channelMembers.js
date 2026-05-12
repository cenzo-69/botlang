'use strict';
// $channelMembers[channelID?;separator?]  — returns member IDs visible in channel
module.exports = async (context, args) => {
  const id  = String(args[0] !== undefined ? args[0] : '').trim();
  const sep = String(args[1] !== undefined ? args[1] : ', ');
  try {
    const ch = id ? await context.client?.channels.fetch(id) : context.message?.channel;
    if (!ch) return '[error: $channelMembers — channel not found]';
    // Voice channel
    if (ch.members) return [...ch.members.keys()].join(sep);
    // Text channel — members who can view it
    if (ch.guild) {
      await ch.guild.members.fetch();
      const ids = ch.guild.members.cache
        .filter(m => ch.permissionsFor(m)?.has('ViewChannel'))
        .map(m => m.id);
      return ids.join(sep);
    }
    return '';
  } catch (err) { return `[error: $channelMembers — ${err.message}]`; }
};
