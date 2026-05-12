'use strict';

// $serverRegion
// Returns the guild's preferred locale (Discord removed explicit regions in 2021).
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  return context.message.guild.preferredLocale ?? '';
};
