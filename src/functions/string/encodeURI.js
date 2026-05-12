'use strict';

// $encodeURI[text]  — URL-encode a string (encodeURIComponent)
module.exports = async (context, args) => {
  const text = String(args[0] ?? '');
  try {
    return encodeURIComponent(text);
  } catch {
    return '[encodeURI error: invalid input]';
  }
};
