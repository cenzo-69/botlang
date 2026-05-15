'use strict';

// $discriminator[userID?]
// Returns the discriminator of the author or a specified user (returns "0" for migrated accounts).
module.exports = async (context, args) => {
  const userID = String(args[0] || '').trim();
  if (userID) {
    try {
      const user = await context.client.users.fetch(userID);
      return user.discriminator || '0';
    } catch (err) {
      return `[error: ${err.message}!]`;
    }
  }
  return context.message?.author?.discriminator || '0';
};
