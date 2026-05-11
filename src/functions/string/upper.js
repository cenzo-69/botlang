'use strict';

// $upper[text]
module.exports = async (context, args) => {
  return String(args[0] || '').toUpperCase();
};
