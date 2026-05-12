'use strict';
// $italic[text]  — wraps text in *italic* markdown
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return `*${text}*`;
};
