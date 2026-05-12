'use strict';
// $userGlobalName[userID?]  — returns the user's global display name (new display name system)
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim() || context.message?.author?.id;
  if (!userID) return '';
  try {
    const user = await context.client?.users.fetch(userID);
    return user?.globalName ?? user?.username ?? '';
  } catch { return ''; }
};
