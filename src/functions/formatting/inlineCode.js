'use strict';
// $inlineCode[text]  — wraps text in `backticks`
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return `\`${text}\``;
};
