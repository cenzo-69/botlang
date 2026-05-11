'use strict';

// $titlecase[text]  — capitalise the first letter of each word
module.exports = async (context, args) => {
  const text = String(args[0] || '');
  return text.replace(/\b\w/g, c => c.toUpperCase());
};
