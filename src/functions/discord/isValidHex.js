'use strict';

// $isValidHex[hex]
// Returns "true" if the value is a valid 6-digit hex color code (with or without #).
module.exports = async (context, args) => {
  const hex = String(args[0] || '').trim().replace(/^#/, '');
  return String(/^[0-9A-Fa-f]{6}$/.test(hex));
};
