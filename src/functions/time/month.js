'use strict';

// $month  — returns the current month number (1–12)
module.exports = async (context, args) => {
  return String(new Date().getMonth() + 1);
};
