'use strict';

// $forEachValue — returns the current element value inside a $forEach body
module.exports = async (context) => {
  return context.variables.get('__foreach_value__') ?? '';
};
