'use strict';

const { resolveUser } = require('../../core/resolveUser');

// $userBannerColor[userID?]
// Returns the user's banner color as a hex string (e.g. "#ff0000").
// Returns empty string if the user has no banner color.
module.exports = async (context, args) => {
  const user = await resolveUser(context, args[0]);
  if (!user) return '';
  const col = user.accentColor;
  if (!col) return '';
  return '#' + col.toString(16).padStart(6, '0');
};
