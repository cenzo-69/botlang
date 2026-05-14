'use strict';

const { argError } = require('../../core/fnError');
// $jsonLoad[variable]  — loads a stored JSON object from context variable
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);
  return String(context.variables.get(`__json_${name}__`) ?? '{}');
};
