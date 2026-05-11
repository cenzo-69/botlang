'use strict';

// $author[name]  — set embed author name
module.exports = async (context, args) => {
  context.embed.author.name = args[0] || null;
  return '';
};
