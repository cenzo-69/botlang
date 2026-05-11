'use strict';

// $year  — returns the current 4-digit year
module.exports = async (context, args) => {
  return String(new Date().getFullYear());
};
