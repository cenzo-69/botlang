'use strict';

const { argError } = require('../../core/fnError');
const parseTime = require('../../core/parseTime');
// $parseString[duration]  — converts duration string (1h30m) to milliseconds
module.exports = async (context, args) => {
  const str = String(args[0] !== undefined ? args[0] : '').trim();
  if (!str) return argError(context, 'str', 'string', str);
  // Handle compound durations like 1h30m2s
  let total = 0;
  const matches = str.match(/(\d+(?:\.\d+)?)(ms|s|m|h|d)/gi);
  if (matches) {
    for (const m of matches) total += parseTime(m);
    return String(total);
  }
  const ms = parseTime(str);
  if (!ms) return '[error: $parseString — invalid duration format. Examples: 30s, 5m, 2h, 1d, 1h30m]';
  return String(ms);
};
