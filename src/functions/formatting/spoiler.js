'use strict';
// $spoiler[text]  — wraps text in ||spoiler|| markdown
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return `||${text}||`;
};
