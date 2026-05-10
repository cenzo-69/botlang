'use strict';

// $includes[text;search]  → true | false
module.exports = async (context, args) => {
  const text   = String(args[0] || '');
  const search = String(args[1] || '');
  return String(text.includes(search));
};
