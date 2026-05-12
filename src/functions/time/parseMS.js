'use strict';
// $parseMS[ms;limit?;separator?;and?]  — converts milliseconds to human-readable duration
module.exports = async (context, args) => {
  const ms  = parseInt(args[0]);
  const limit = parseInt(args[1] !== undefined ? args[1] : 0) || 0;
  const sep = args[2] !== undefined ? String(args[2]) : ', ';
  const and = args[3] !== undefined ? String(args[3]) : '';
  if (isNaN(ms)) return '[error: $parseMS — argument must be a valid number of milliseconds]';
  const parts = [];
  const units = [
    [86400000, 'day'],
    [3600000, 'hour'],
    [60000, 'minute'],
    [1000, 'second'],
  ];
  let remaining = Math.abs(ms);
  for (const [unit, name] of units) {
    const val = Math.floor(remaining / unit);
    if (val > 0) {
      parts.push(`${val} ${name}${val !== 1 ? 's' : ''}`);
      remaining %= unit;
    }
  }
  if (!parts.length) parts.push('0 seconds');
  const limited = limit > 0 ? parts.slice(0, limit) : parts;
  if (and && limited.length > 1) {
    return limited.slice(0, -1).join(sep) + ' ' + and + ' ' + limited[limited.length - 1];
  }
  return limited.join(sep);
};
