'use strict';
// $isJSON[text]  — returns "true" if text is valid JSON
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  try { JSON.parse(text); return 'true'; }
  catch { return 'false'; }
};
