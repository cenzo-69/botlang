'use strict';

// $lower[text]
module.exports = async (context, args) => {
  return String(args[0] || '').toLowerCase();
};
