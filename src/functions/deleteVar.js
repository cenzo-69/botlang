'use strict';

// $deleteVar[name]
module.exports = async (context, args) => {
  const name = args[0];
  if (name) context.deleteVariable(name);
  return '';
};
