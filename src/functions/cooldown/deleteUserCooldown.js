'use strict';
// $deleteUserCooldown[userID?]  — removes a user's cooldown
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim() || context.message?.author?.id || 'unknown';
  context.variables.delete(`__cd_user_${userID}__`);
  return '';
};
