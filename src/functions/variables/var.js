'use strict';

// $var[name;value]  — set a session variable
module.exports = async (context, args) => {
  const name = args[0];
  const value = args[1] !== undefined ? args[1] : '';

  if (!name) return '';

  context.setVariable(name, value);
  return '';
};
