'use strict';

// $date  — returns current date as YYYY-MM-DD
// $date[format]  — custom format using tokens: YYYY MM DD
module.exports = async (context, args) => {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const format = args[0];

  if (!format) {
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }

  return format
    .replace('YYYY', now.getFullYear())
    .replace('MM',   pad(now.getMonth() + 1))
    .replace('DD',   pad(now.getDate()));
};
