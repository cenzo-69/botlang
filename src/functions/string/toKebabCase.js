'use strict';
// $toKebabCase[text]  — converts text to kebab-case
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};
