'use strict';

// $startsWith[text;prefix]  → true | false
module.exports = async (context, args) => {
  const text   = String(args[0] ?? '');
  const prefix = String(args[1] ?? '');
  return String(text.startsWith(prefix));
};
