'use strict';

const { argError } = require('../../core/fnError');
// $arrayUnload[variable]  — removes the array variable from context
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);
  context.variables.delete(`__array_${name}__`);
  return '';
};
