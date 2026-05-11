'use strict';

// $lowercase[text]  — convert text to lowercase (alias for $lower)
module.exports = async (context, args) => {
  return String(args[0] || '').toLowerCase();
};
