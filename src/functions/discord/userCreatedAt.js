'use strict';
// $userCreatedAt[userID?]  — ISO creation date of a user's account
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim() || context.message?.author?.id;
  if (!userID) return '[error: $userCreatedAt — userID is required]';
  try {
    const user = await context.client?.users.fetch(userID);
    return user?.createdAt.toISOString() ?? '';
  } catch (err) { return `[error: $userCreatedAt — ${err.message}]`; }
};
