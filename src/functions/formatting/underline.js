'use strict';
// $underline[text]  — wraps text in __underline__ markdown
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return `__${text}__`;
};
