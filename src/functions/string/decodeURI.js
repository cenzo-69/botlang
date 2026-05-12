'use strict';

// $decodeURI[text]  — decode a URL-encoded string (decodeURIComponent)
module.exports = async (context, args) => {
  const text = String(args[0] ?? '');
  try {
    return decodeURIComponent(text);
  } catch {
    return '[decodeURI error: invalid encoding]';
  }
};
