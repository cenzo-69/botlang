'use strict';

const { argError } = require('../../core/fnError');

// $vcMoveUser[userID;channelID;reason?]
// Moves a member to a different voice channel.
module.exports = async (context, args) => {
  const userID    = String(args[0] !== undefined ? args[0] : '').trim();
  const channelID = String(args[1] !== undefined ? args[1] : '').trim();
  const reason    = String(args[2] !== undefined ? args[2] : '').trim() || 'No reason provided';

  if (!userID)    return argError(context, 'user ID', 'Snowflake', userID);
  if (!channelID) return argError(context, 'channel ID', 'TextChannel', channelID);
  if (!context.message?.guild) return '[error: Not in a guild!]';

  try {
    const member = await context.message.guild.members.fetch(userID).catch(() => null);
    if (!member) return '[error: Member not found!]';
    await member.voice.setChannel(channelID, reason);
    return '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
