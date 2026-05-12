'use strict';

// $isNumber[value]
// Returns "true" if value is a valid finite number, "false" otherwise.
module.exports = async (context, args) => {
  const val = String(args[0] !== undefined ? args[0] : '').trim();
  return String(val !== '' && !isNaN(val) && isFinite(Number(val)));
};
