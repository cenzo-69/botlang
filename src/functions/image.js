'use strict';

// $image[url]  — set embed large image
module.exports = async (context, args) => {
  context.embed.image = args[0] || null;
  return '';
};
