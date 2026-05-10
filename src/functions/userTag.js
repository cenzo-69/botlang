'use strict';

// $userTag → Username#0000 (or just Username on the new system)
module.exports = async (context) => {
  if (!context.message) return '[no message]';
  const { author } = context.message;
  return author.discriminator && author.discriminator !== '0'
    ? `${author.username}#${author.discriminator}`
    : author.username;
};
