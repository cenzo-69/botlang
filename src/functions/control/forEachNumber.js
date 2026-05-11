'use strict';

// $forEachNumber — returns the 1-based iteration number inside a $forEach body
module.exports = async (context) => {
  return context.variables.get('__foreach_number__') ?? '';
};
