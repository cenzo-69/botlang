'use strict';

// $trimContent[text]  — remove leading and trailing whitespace (alias for $trim)
module.exports = async (context, args) => {
  return String(args[0] || '').trim();
};
