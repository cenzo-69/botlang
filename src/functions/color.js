'use strict';

// $color[#hex]  — set the embed accent color
module.exports = async (context, args) => {
  context.embed.color = args[0] || null;
  return '';
};
