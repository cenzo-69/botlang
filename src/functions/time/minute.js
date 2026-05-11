'use strict';

// $minute  — returns the current minute (0–59)
module.exports = async (context, args) => {
  return String(new Date().getMinutes());
};
