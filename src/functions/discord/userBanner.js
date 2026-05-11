'use strict';

const { resolveUser } = require('../../core/resolveUser');

// $userBanner[userID?]  — user profile banner URL (empty if none)
// Note: banners require fetching the user with force:true to get the banner field.
module.exports = async (context, args) => {
  const user = await resolveUser(context, args[0]);
  if (!user) return '';
  return user.bannerURL({ size: 1024 }) || '';
};
