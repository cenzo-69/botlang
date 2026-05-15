'use strict';

const { argError } = require('../../core/fnError');
// $arrayClear[variable]  — removes all elements from array
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);
  if (!context.variables.has(`__array_${name}__`)) return `[error: Array "${name}" does not exist!]`;
  context.variables.set(`__array_${name}__`, JSON.stringify([]));
  return '';
};
