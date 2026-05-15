'use strict';

const { argError } = require('../../core/fnError');

// $setNick[userID;nickname;reason?]
// Sets or resets a member's server nickname. Pass empty string to clear nick.
module.exports = async (context, args) => {
  const userID   = String(args[0] !== undefined ? args[0] : '').trim();
  const nickname = String(args[1] !== undefined ? args[1] : '').trim() || null;
  const reason   = String(args[2] !== undefined ? args[2] : '').trim() || 'No reason provided';

  if (!userID) return argError(context, 'user ID', 'Snowflake', userID);
  if (!context.message?.guild) return '[error: Not in a guild!]';

  try {
    const member = await context.message.guild.members.fetch(userID).catch(() => null);
    if (!member) return '[error: Member not found!]';
    await member.setNickname(nickname, reason);
    return '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
