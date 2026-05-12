'use strict';

// $isURL[text]  → true | false
module.exports = async (context, args) => {
  const text = String(args[0] ?? '');
  try {
    const url = new URL(text);
    return String(url.protocol === 'http:' || url.protocol === 'https:');
  } catch {
    return 'false';
  }
};
