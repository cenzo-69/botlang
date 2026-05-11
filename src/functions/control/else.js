'use strict';

// $else — stray handler
//
// Inside a block $if, $else is consumed by the Parser and never becomes
// a function node. If this function is called, it means $else appeared
// outside a $if block, which is a syntax error.
module.exports = async (context, args) => {
  return '[error: $else without $if]';
};
