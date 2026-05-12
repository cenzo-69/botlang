'use strict';
// $localeCompare[first;second]  — returns -1, 0, or 1 locale-aware comparison
module.exports = async (context, args) => {
  const a = String(args[0] !== undefined ? args[0] : '');
  const b = String(args[1] !== undefined ? args[1] : '');
  return String(a.localeCompare(b));
};
