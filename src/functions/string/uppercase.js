'use strict';

// $uppercase[text]  — convert text to UPPERCASE (alias for $upper)
module.exports = async (context, args) => {
  return String(args[0] || '').toUpperCase();
};
