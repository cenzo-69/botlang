'use strict';
// $deleteCooldown  — removes the current user's global cooldown
module.exports = async (context) => {
  const userID = context.message?.author?.id ?? 'unknown';
  context.variables.delete(`__cd_user_${userID}__`);
  return '';
};
