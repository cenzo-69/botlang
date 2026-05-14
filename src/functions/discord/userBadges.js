'use strict';

const { argError } = require('../../core/fnError');

// $userBadges[userID;(separator)]
// Returns the public badge flags of a user as a joined string.
module.exports = async (context, args) => {
  const userID = String(args[0] || '').trim() || context.message?.author?.id;
  const sep    = String(args[1] !== undefined ? args[1] : ', ');
  if (!userID) return argError(context, 'user ID', 'Snowflake', userID);
  try {
    const user  = await context.client.users.fetch(userID, { force: true });
    const flags = user.flags?.toArray() ?? [];
    return flags.length ? flags.join(sep) : 'None';
  } catch (err) {
    return `[error: $userBadges — ${err.message}]`;
  }
};
