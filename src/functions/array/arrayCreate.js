'use strict';
// $arrayCreate[variable;length?]  — initializes an empty array stored under variable name
// Arrays are stored in context.variables as JSON under key __array_<name>__
module.exports = async (context, args) => {
  const name   = String(args[0] !== undefined ? args[0] : '').trim();
  const length = args[1] !== undefined ? parseInt(args[1]) : 0;
  if (!name) return '[error: $arrayCreate — variable name is required. Usage: $arrayCreate[myArray]]';
  const arr = Array(Math.max(0, isNaN(length) ? 0 : length)).fill(null);
  context.variables.set(`__array_${name}__`, JSON.stringify(arr));
  return '';
};
