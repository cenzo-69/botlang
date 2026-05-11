'use strict';

// $serverBanner  — the server's banner URL (empty string if none)
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  return context.message.guild.bannerURL({ size: 1024 }) || '';
};
