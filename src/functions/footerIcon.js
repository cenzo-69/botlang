'use strict';

// $footerIcon[url]  — set embed footer icon URL
module.exports = async (context, args) => {
  context.embed.footer.iconURL = args[0] || null;
  return '';
};
