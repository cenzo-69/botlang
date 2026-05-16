'use strict';

// $inviteCode[codeOrURL]
// Extracts and returns just the invite code from a full URL or bare code.
// e.g. $inviteCode[https://discord.gg/abc123] → abc123
module.exports = async (context, args) => {
  const input = String(args[0] !== undefined ? args[0] : '').trim();
  if (!input) return '[error: Missing invite code or URL!]';
  // Strip any discord.gg URL prefix
  return input.replace(/^https?:\/\/(www\.)?discord\.gg\//i, '').split('/')[0].trim();
};
