'use strict';
// $isBoolean[value]  — returns "true" if value is boolean-like ("true"/"false"/"1"/"0")
module.exports = async (context, args) => {
  const s = String(args[0] !== undefined ? args[0] : '').trim().toLowerCase();
  return String(s === 'true' || s === 'false' || s === '1' || s === '0');
};
