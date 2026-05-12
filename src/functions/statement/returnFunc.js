'use strict';
// $return[value]  — returns a value from the current code block
module.exports = async (context, args) => {
  const value = args[0] !== undefined ? String(args[0]) : '';
  context.variables.set('__return__', value);
  context.stop();
  return value;
};
