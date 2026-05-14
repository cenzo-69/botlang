'use strict';

const { argError } = require('../../core/fnError');
// $userCreatedAt[userID?]  — ISO creation date of a user's account
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim() || context.message?.author?.id;
  if (!userID) return argError(context, 'user ID', 'Snowflake', userID);
  try {
    const user = await context.client?.users.fetch(userID);
    return user?.createdAt.toISOString() ?? '';
  } catch (err) { return `[error: $userCreatedAt — ${err.message}]`; }
};
