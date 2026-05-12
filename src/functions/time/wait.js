'use strict';

const parseTime = require('../../core/parseTime');
const fnError   = require('../../core/fnError');

// $wait[duration]  — pauses execution for the given duration
module.exports = async (context, args) => {
  const raw = args[0] !== undefined ? String(args[0]).trim() : '';
  const ms  = parseTime(raw);

  if (!ms) {
    return fnError('wait', 'invalid or missing duration', {
      got:      raw || '(empty)',
      expected: 'a duration string like `2s`, `500ms`, `1m`, `1h`',
      example:  '$wait[3s]',
    });
  }

  await new Promise(resolve => setTimeout(resolve, ms));
  return '';
};
