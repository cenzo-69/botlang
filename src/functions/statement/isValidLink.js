'use strict';
// $isValidLink[link]  — returns "true" if the string is a valid URL format
module.exports = async (context, args) => {
  const link = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    new URL(link);
    return String(/^https?:\/\//i.test(link));
  } catch { return 'false'; }
};
