'use strict';

const parseTime = require('../../core/parseTime');

// $replyIn[duration]  — schedule the reply after a delay
// Duration: 30s | 5m | 2h | 1d
module.exports = async (context, args) => {
  const ms = parseTime(args[0]);
  if (!ms) return '[error: Invalid duration. Usage: $replyIn[30s!] | $replyIn[5m] | $replyIn[1h] | $replyIn[1d]]';
  context.variables.set('__reply_delay__', ms);
  return '';
};
