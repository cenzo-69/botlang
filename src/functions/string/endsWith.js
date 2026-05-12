'use strict';

// $endsWith[text;suffix]  → true | false
module.exports = async (context, args) => {
  const text   = String(args[0] ?? '');
  const suffix = String(args[1] ?? '');
  return String(text.endsWith(suffix));
};
