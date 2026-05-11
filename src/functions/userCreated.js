'use strict';

const { resolveUser } = require('../core/resolveUser');

// $userCreated[userID?]  — ISO 8601 account creation date
// The creation time is derived from the Discord snowflake ID.
module.exports = async (context, args) => {
  const user = await resolveUser(context, args[0]);
  if (!user) return '[error: could not fetch user]';
  return user.createdAt.toISOString();
};
