'use strict';

// $title[text]  — set the embed title
module.exports = async (context, args) => {
  context.embed.title = args[0] || null;
  return '';
};
