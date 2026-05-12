'use strict';

// $isBoolean[value]
// Returns "true" if value is exactly "true" or "false" (case-insensitive).
module.exports = async (context, args) => {
  const val = String(args[0] !== undefined ? args[0] : '').trim().toLowerCase();
  return String(val === 'true' || val === 'false');
};
