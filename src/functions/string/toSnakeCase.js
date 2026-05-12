'use strict';
// $toSnakeCase[text]  — converts text to snake_case
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return text
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
};
