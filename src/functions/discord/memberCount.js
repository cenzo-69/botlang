'use strict';

module.exports = async (context) => {
  if (!context.message?.guild) return '[no guild]';
  return String(context.message.guild.memberCount);
};
