'use strict';
// $toCamelCase[text]  — converts text to camelCase
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return text
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, c => c.toLowerCase());
};
