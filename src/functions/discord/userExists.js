'use strict';

// $userExists[userID]
// Returns "true" if the user ID resolves to a valid Discord user, "false" otherwise.
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!userID || !context.client) return 'false';
  try {
    await context.client.users.fetch(userID);
    return 'true';
  } catch {
    return 'false';
  }
};
