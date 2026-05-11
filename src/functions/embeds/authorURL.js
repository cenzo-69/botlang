'use strict';

// $authorURL[url]  — set the embed author URL (clickable link on the author name)
module.exports = async (context, args) => {
  context.embed.author.url = args[0] || null;
  return '';
};
