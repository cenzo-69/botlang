'use strict';

// $authorIcon[url]  — set embed author icon URL
module.exports = async (context, args) => {
  context.embed.author.iconURL = args[0] || null;
  return '';
};
