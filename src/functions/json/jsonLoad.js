'use strict';
// $jsonLoad[variable]  — loads a stored JSON object from context variable
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return '[error: $jsonLoad — variable name is required]';
  return String(context.variables.get(`__json_${name}__`) ?? '{}');
};
