'use strict';

// $humanCount  — number of non-bot members in the server
// Force-fetches the member list so the count is accurate on all hosting providers.
// Falls back to the cache if fetch fails (e.g. missing GuildMembers intent).
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  try {
    const fetched = await context.message.guild.members.fetch({ force: true });
    return String([...fetched.values()].filter(m => !m.user.bot).length);
  } catch {
    const cached = [...context.message.guild.members.cache.values()];
    return String(cached.filter(m => !m.user.bot).length);
  }
};
