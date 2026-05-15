'use strict';
// $unparseDigital[HH:MM:SS]  — converts HH:MM:SS back to milliseconds
module.exports = async (context, args) => {
  const str = String(args[0] !== undefined ? args[0] : '').trim();
  const parts = str.split(':').map(Number);
  if (parts.some(isNaN)) return '[error: Invalid HH:MM:SS format!]';
  let ms = 0;
  if (parts.length === 3) ms = parts[0]*3600000 + parts[1]*60000 + parts[2]*1000;
  else if (parts.length === 2) ms = parts[0]*60000 + parts[1]*1000;
  else if (parts.length === 1) ms = parts[0]*1000;
  return String(ms);
};
