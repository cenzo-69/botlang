'use strict';
// $strikethrough[text]  — wraps text in ~~strikethrough~~ markdown
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return `~~${text}~~`;
};
