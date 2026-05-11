'use strict';

// $allMemberIDs[separator?]
// Returns a separated list of all member IDs in the guild.
//
// Fix for external hosting providers:
// - Always force-fetches the full member list (not just the cache) so this
//   works correctly even when the member cache is partial or empty at startup.
// - Requires the GuildMembers privileged intent in Discord developer portal.
// - Falls back gracefully to the local cache if the fetch fails (e.g. intent
//   not enabled, network error, or guild has >1 000 members and bulk fetch
//   is rate-limited).
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';

  const sep = args[0] !== undefined ? args[0] : ', ';

  try {
    // force: true bypasses the local cache and makes a fresh API call.
    // This is the key fix for non-Replit hosting providers.
    const fetched = await context.message.guild.members.fetch({ force: true });
    return [...fetched.values()].map(m => m.id).join(sep);
  } catch (err) {
    // Graceful fallback — return whatever is already in the local cache.
    const cached = [...context.message.guild.members.cache.values()];
    if (cached.length) {
      console.warn(`[$allMemberIDs] fetch failed (${err.message}); using cache (${cached.length} members)`);
      return cached.map(m => m.id).join(sep);
    }
    return '[error: could not fetch members — enable the GuildMembers intent in the Discord developer portal]';
  }
};
