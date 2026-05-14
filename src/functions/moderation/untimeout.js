'use strict';

const { argError } = require('../../core/fnError');

// $untimeout[userID]
// Removes an active timeout from a guild member.
// Returns empty string on success.
module.exports = async (context, args) => {
  const guild  = context.message?.guild;
  if (!guild) return '[error: no guild]';
  const userID = String(args[0] || '').trim();
  if (!userID) return argError(context, 'user ID', 'Snowflake', userID);
  try {
    const member = await guild.members.fetch(userID);
    await member.timeout(null); // null removes the timeout
    return '';
  } catch (err) {
    return `[error: ${err.message}]`;
  }
};
