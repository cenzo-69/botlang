'use strict';

const { argError } = require('../../core/fnError');
// $arraySort[variable;outputVar?;sortType?]  — sorts array (asc/desc/numeric)
module.exports = async (context, args) => {
  const name     = String(args[0] !== undefined ? args[0] : '').trim();
  const outVar   = args[1] !== undefined ? String(args[1]).trim() : '';
  const sortType = String(args[2] !== undefined ? args[2] : 'asc').toLowerCase();
  if (!name) return argError(context, 'name', 'string', name);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arraySort — array "${name}" does not exist]`;
  let arr;
  try { arr = JSON.parse(raw); } catch { return '[error: $arraySort — corrupted array data]'; }
  let sorted;
  if (sortType === 'numeric' || sortType === 'num') {
    sorted = [...arr].sort((a, b) => parseFloat(a) - parseFloat(b));
  } else if (sortType === 'desc') {
    sorted = [...arr].sort((a, b) => String(b).localeCompare(String(a)));
  } else {
    sorted = [...arr].sort((a, b) => String(a).localeCompare(String(b)));
  }
  const target = outVar || name;
  context.variables.set(`__array_${target}__`, JSON.stringify(sorted));
  return outVar ? '' : JSON.stringify(sorted);
};
