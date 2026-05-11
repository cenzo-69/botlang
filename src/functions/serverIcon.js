'use strict';

// $serverIcon  — the server's icon URL (empty string if none)
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  return context.message.guild.iconURL({ size: 1024 }) || '';
};
