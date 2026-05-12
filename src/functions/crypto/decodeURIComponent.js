'use strict';
// $decodeURIComponent[text]  — decodes a percent-encoded URI component
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  try {
    return decodeURIComponent(text);
  } catch {
    return '[error: $decodeURIComponent — malformed URI component]';
  }
};
