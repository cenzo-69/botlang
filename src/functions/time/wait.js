'use strict';
const parseTime = require('../../core/parseTime');
// $wait[duration]  — pauses execution for the given duration (s/h/d)
module.exports = async (context, args) => {
  const ms = parseTime(args[0]);
  if (!ms) return '[error: $wait — invalid duration. Usage: $wait[2s] | $wait[500ms] | $wait[1m]]';
  await new Promise(resolve => setTimeout(resolve, ms));
  return '';
};
