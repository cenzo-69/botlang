'use strict';

// $forEachIndex — returns the 0-based iteration index inside a $forEach body
module.exports = async (context) => {
  return context.variables.get('__foreach_index__') ?? '';
};
