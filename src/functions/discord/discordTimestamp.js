'use strict';

// $discordTimestamp[unixMs?;format?]
// Returns a Discord dynamic timestamp tag: <t:UNIX:FORMAT>
// unixMs  — Unix timestamp in ms (defaults to now)
// format  — t|T|d|D|f|F|R  (default: f = long date + time)
//   t  short time       3:04 PM
//   T  long time        3:04:05 PM
//   d  short date       5/11/2026
//   D  long date        May 11, 2026
//   f  long date+time   May 11, 2026 3:04 PM  (default)
//   F  day+date+time    Monday, May 11, 2026 3:04 PM
//   R  relative         in 2 days / 3 years ago
const VALID_FORMATS = new Set(['t', 'T', 'd', 'D', 'f', 'F', 'R']);

module.exports = async (context, args) => {
  const ms     = parseInt(args[0]) || Date.now();
  const format = String(args[1] !== undefined ? args[1] : '').trim() || 'f';

  const unix = Math.floor(ms / 1000);
  const fmt  = VALID_FORMATS.has(format) ? format : 'f';
  return `<t:${unix}:${fmt}>`;
};
