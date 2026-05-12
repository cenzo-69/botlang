'use strict';
// $bold[text]  — wraps text in **bold** markdown
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return `**${text}**`;
};
