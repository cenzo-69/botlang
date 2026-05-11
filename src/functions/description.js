'use strict';

// $description[text]  — set the embed description
module.exports = async (context, args) => {
  context.embed.description = args[0] || null;
  return '';
};
