'use strict';

// $endif — stray handler
//
// Inside a block $if, $endif is consumed by the Parser and never becomes
// a function node. This function handles the rare case where $endif appears
// outside a block (e.g., mismatched block). Returns empty string silently.
module.exports = async (context, args) => {
  return '';
};
