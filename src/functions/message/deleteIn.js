'use strict';

const parseTime = require('../../core/parseTime');

// $deleteIn[duration]  — delete the bot reply after a delay
// Duration: 30s | 5m | 2h | 1d
module.exports = async (context, args) => {
  const ms = parseTime(args[0]);
  if (!ms) return '[error: Invalid duration. Usage: $deleteIn[30s!] | $deleteIn[5m] | $deleteIn[1h] | $deleteIn[1d]]';
  context.variables.set('__delete_after__', ms);
  return '';
};
