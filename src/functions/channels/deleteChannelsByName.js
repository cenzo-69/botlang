'use strict';

// $deleteChannelsByName[name;...]
// Deletes all channels whose name matches any of the provided names. Returns the count deleted.
module.exports = async (context, args) => {
  const names = args.map(a => String(a).toLowerCase().trim()).filter(Boolean);
  if (!names.length) return '[error: $deleteChannelsByName requires at least one name]';
  const guild = context.message?.guild;
  if (!guild) return '[error: no guild]';
  let deleted = 0;
  for (const ch of guild.channels.cache.values()) {
    if (names.includes(ch.name.toLowerCase())) {
      try { await ch.delete(); deleted++; } catch {}
    }
  }
  return String(deleted);
};
