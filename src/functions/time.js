'use strict';

// $time              → Unix timestamp in seconds
// $time[format]      → formatted date string
//   Supported tokens: YYYY MM DD HH mm ss
module.exports = async (context, args) => {
  const now = new Date();
  const format = args[0];

  if (!format) return String(Math.floor(now.getTime() / 1000));

  const pad = n => String(n).padStart(2, '0');
  return format
    .replace('YYYY', now.getFullYear())
    .replace('MM',   pad(now.getMonth() + 1))
    .replace('DD',   pad(now.getDate()))
    .replace('HH',   pad(now.getHours()))
    .replace('mm',   pad(now.getMinutes()))
    .replace('ss',   pad(now.getSeconds()));
};
