'use strict';
// $toTitleCase[text]  — converts text to Title Case
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return text.replace(/\b\w/g, c => c.toUpperCase());
};
