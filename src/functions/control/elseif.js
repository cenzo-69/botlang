'use strict';

// $elseif — stray handler
//
// Inside a block $if, $elseif is consumed by the Parser and never becomes
// a function node. If this function is called, it means $elseif appeared
// outside a $if block, which is a syntax error.
module.exports = async (context, args) => {
  return '[error: $elseif without $if]';
};
