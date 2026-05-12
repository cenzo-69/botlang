'use strict';
// $arrayClear[variable]  — removes all elements from array
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return '[error: $arrayClear — variable name is required]';
  if (!context.variables.has(`__array_${name}__`)) return `[error: $arrayClear — array "${name}" does not exist]`;
  context.variables.set(`__array_${name}__`, JSON.stringify([]));
  return '';
};
