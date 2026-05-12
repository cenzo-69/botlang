'use strict';
// $calendarWeek  — returns current ISO week number of the year
module.exports = async () => {
  const d   = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  return String(Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7));
};
