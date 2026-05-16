'use strict';

// $inviteURL[code]
// Returns the full Discord invite URL for a given invite code.
// If code already contains "discord.gg" it is returned as-is.
module.exports = async (context, args) => {
  const code = String(args[0] !== undefined ? args[0] : '').trim();
  if (!code) return '[error: Missing invite code!]';
  if (code.includes('discord.gg')) return code;
  return `https://discord.gg/${code}`;
};
