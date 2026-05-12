'use strict';

// $dm[userID;message]
// Sends a direct message to the specified user. Returns empty string on success.
module.exports = async (context, args) => {
  const userID  = String(args[0] || '').trim();
  const message = String(args[1] !== undefined ? args[1] : '');
  if (!userID)   return '[error: $dm requires a userID]';
  if (!message)  return '[error: $dm requires a message]';
  try {
    const user = await context.client.users.fetch(userID);
    await user.send(message);
    return '';
  } catch (err) {
    return `[error: $dm — ${err.message}]`;
  }
};
