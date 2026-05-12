'use strict';
// $arrayUnload[variable]  — removes the array variable from context
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return '[error: $arrayUnload — variable name is required]';
  context.variables.delete(`__array_${name}__`);
  return '';
};
