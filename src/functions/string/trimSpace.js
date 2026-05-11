'use strict';

// $trimSpace[text]  — collapse all internal whitespace runs to a single space, then trim
module.exports = async (context, args) => {
  return String(args[0] || '').replace(/\s+/g, ' ').trim();
};
