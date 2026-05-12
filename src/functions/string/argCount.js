'use strict';
// $argCount[text]  — counts space-separated word arguments in text
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '').trim();
  if (!text) return '0';
  return String(text.split(/\s+/).length);
};
