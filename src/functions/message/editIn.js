'use strict';

const parseTime = require('../../core/parseTime');

// $editIn[duration;newContent]  — edit the bot reply after a delay
// Duration: 30s | 5m | 2h | 1d
module.exports = async (context, args) => {
  const ms      = parseTime(args[0]);
  const content = String(args[1] !== undefined ? args[1] : '');
  if (!ms) return '[error: Invalid duration. Usage: $editIn[30s;New content!] | $editIn[2m;Done!]]';
  context.variables.set('__edit_after__', { ms, content });
  return '';
};
