'use strict';

// $serverVanity  — vanity URL code (e.g. "discord") or empty string if none
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  return context.message.guild.vanityURLCode || '';
};
