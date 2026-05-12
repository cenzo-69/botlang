'use strict';

// $endasync
// Marks the end of a named async block definition (used with $async[name]).
module.exports = async (context, _args) => {
  context.variables.delete('__async_current__');
  return '';
};
