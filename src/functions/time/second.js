'use strict';

// $second  — returns the current second (0–59)
module.exports = async (context, args) => {
  return String(new Date().getSeconds());
};
