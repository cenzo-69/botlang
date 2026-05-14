'use strict';

const { argError } = require('../../core/fnError');

// $async[blockName]
// Marks the start of a named async block definition.
// Everything between $async[name] and $endasync is stored and executed on $await[name].
// In this runtime the block is stored as a raw script string in __async_<name>__.
// NOTE: Block capture requires the script to have $async[name]...$endasync at the top level.
// This function sets the context flag — the outer handler extracts the block at parse time.
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);
  context.variables.set('__async_current__', name);
  return '';
};
