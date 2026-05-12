'use strict';
// $trimLines[text]  — removes empty lines from text
module.exports = async (context, args) => {
  return String(args[0] !== undefined ? args[0] : '')
    .split('\n')
    .filter(line => line.trim() !== '')
    .join('\n');
};
