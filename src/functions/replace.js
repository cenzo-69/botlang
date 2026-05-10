'use strict';

// $replace[text;search;replacement]
module.exports = async (context, args) => {
  const text        = String(args[0] || '');
  const search      = String(args[1] || '');
  const replacement = String(args[2] || '');
  if (!search) return text;
  return text.split(search).join(replacement);
};
