'use strict';

// $trim[text]
module.exports = async (context, args) => {
  return String(args[0] || '').trim();
};
