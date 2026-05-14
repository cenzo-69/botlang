'use strict';

const { argError } = require('../../core/fnError');
// $parseDigital[ms]  — converts milliseconds to HH:MM:SS format
module.exports = async (context, args) => {
  const ms = parseInt(args[0]);
  if (isNaN(ms)) return argError(context, 'value', 'number', args[0]);
  const totalSec = Math.floor(Math.abs(ms) / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
};
