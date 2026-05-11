'use strict';

// $randomMemberID  — random member ID from the current guild cache
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  const members = [...context.message.guild.members.cache.values()];
  if (!members.length) return '[error: empty member cache]';
  return members[Math.floor(Math.random() * members.length)].id;
};
