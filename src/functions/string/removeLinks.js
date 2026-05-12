'use strict';

const URL_RE = /https?:\/\/[^\s]+/g;

// $removeLinks[text]
// Removes all HTTP/HTTPS URLs from the text.
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return text.replace(URL_RE, '').replace(/\s{2,}/g, ' ').trim();
};
