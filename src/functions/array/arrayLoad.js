'use strict';
// $arrayLoad[variable;separator?;values?]  — loads a delimited string into an array variable
// If values provided, splits them by separator. Otherwise reads remaining args as elements.
module.exports = async (context, args) => {
  const name  = String(args[0] !== undefined ? args[0] : '').trim();
  const sep   = args[1] !== undefined ? String(args[1]) : ',';
  const input = args[2] !== undefined ? String(args[2]) : '';
  if (!name) return '[error: $arrayLoad — variable name is required]';
  const arr = input ? input.split(sep).map(s => s.trim()) : [];
  context.variables.set(`__array_${name}__`, JSON.stringify(arr));
  return '';
};
