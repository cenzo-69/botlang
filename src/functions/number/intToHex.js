'use strict';

const { argError } = require('../../core/fnError');
// $intToHex[integer]  — converts integer to hex color string (e.g. 16711680 → "#FF0000")
module.exports = async (context, args) => {
  const n = parseInt(args[0]);
  if (isNaN(n)) return argError(context, 'n', 'number', n);
  return '#' + n.toString(16).toUpperCase().padStart(6, '0');
};
