'use strict';
// $isValidHex[hex]  — returns "true" if value is a valid hex color (000000–FFFFFF)
module.exports = async (context, args) => {
  const hex = String(args[0] !== undefined ? args[0] : '').trim().replace(/^#/, '');
  return String(/^[0-9a-fA-F]{6}$/.test(hex));
};
