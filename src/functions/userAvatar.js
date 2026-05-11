'use strict';

const { resolveUser } = require('../core/resolveUser');

// $userAvatar[userID?]  — avatar URL (defaults to author)
// Equivalent to $avatar but uses the resolveUser utility for consistency.
module.exports = async (context, args) => {
  const user = await resolveUser(context, args[0]);
  if (!user) return '';
  return user.displayAvatarURL({ size: 1024 });
};
