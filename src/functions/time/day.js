'use strict';

// $day  — returns the current day of the month (1–31)
module.exports = async (context, args) => {
  return String(new Date().getDate());
};
