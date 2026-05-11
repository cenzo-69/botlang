'use strict';

// $titleURL[url]  — set the embed title URL (clickable link on the title)
module.exports = async (context, args) => {
  context.embed.url = args[0] || null;
  return '';
};
