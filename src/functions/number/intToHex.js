'use strict';
// $intToHex[integer]  — converts integer to hex color string (e.g. 16711680 → "#FF0000")
module.exports = async (context, args) => {
  const n = parseInt(args[0]);
  if (isNaN(n)) return '[error: $intToHex — argument must be a valid integer]';
  return '#' + n.toString(16).toUpperCase().padStart(6, '0');
};
