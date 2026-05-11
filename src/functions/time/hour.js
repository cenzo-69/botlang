'use strict';

// $hour  — returns the current hour (0–23)
module.exports = async (context, args) => {
  return String(new Date().getHours());
};
