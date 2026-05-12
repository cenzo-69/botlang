'use strict';
// $encodeURIComponent[text]  — URL-encodes text (percent-encoding)
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return encodeURIComponent(text);
};
