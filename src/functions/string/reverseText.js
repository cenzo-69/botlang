'use strict';
// $reverseText[text]  — reverses the string character by character
module.exports = async (context, args) => {
  return String(args[0] !== undefined ? args[0] : '').split('').reverse().join('');
};
