'use strict';
// $week  — returns current week number of the year (ISO 8601)
module.exports = async () => {
  const d = new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return String(weekNum);
};
