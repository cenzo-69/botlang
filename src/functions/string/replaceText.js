'use strict';

// $replaceText[text;search;replacement]  — replace all occurrences of search in text
module.exports = async (context, args) => {
  const text        = String(args[0] || '');
  const search      = String(args[1] || '');
  const replacement = String(args[2] !== undefined ? args[2] : '');
  if (!search) return text;
  return text.split(search).join(replacement);
};
