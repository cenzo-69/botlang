'use strict';

// $isInteger[value]
// Returns "true" if value is a whole integer, "false" otherwise.
module.exports = async (context, args) => {
  const val = String(args[0] !== undefined ? args[0] : '').trim();
  if (val === '' || isNaN(val)) return 'false';
  return String(Number.isInteger(Number(val)));
};
