'use strict';
// $weekday[format?]  — returns current day of week
// format: long (default) | short | narrow | number (0=Sun)
module.exports = async (context, args) => {
  const format = String(args[0] !== undefined ? args[0] : 'long').toLowerCase();
  const tz     = context.variables.get('__timezone__') || undefined;
  const d      = new Date();
  if (format === 'number') return String(d.getDay());
  const opts = { weekday: (format === 'short' || format === 'narrow') ? format : 'long', timeZone: tz };
  return new Intl.DateTimeFormat('en-US', opts).format(d);
};
