'use strict';

// $footer[text]  — set embed footer text
module.exports = async (context, args) => {
  context.embed.footer.text = args[0] || null;
  return '';
};
