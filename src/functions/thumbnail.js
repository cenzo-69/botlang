'use strict';

// $thumbnail[url]  — set embed thumbnail image
module.exports = async (context, args) => {
  context.embed.thumbnail = args[0] || null;
  return '';
};
