'use strict';

const evaluateCondition = require('../../core/evaluateCondition');

// $if[condition;thenCode;elseCode?]
//
// Condition formats:
//   value==value   value!=value
//   value>value    value<value
//   value>=value   value<=value
//   value          (truthy: non-empty, non-zero, not "false")
//
// thenCode and elseCode are LAZY — only the matching branch executes.
// The other branch is never evaluated (no side effects).
module.exports = {
  lazy: [1, 2],

  execute: async (context, args) => {
    const condition = String(args[0] || '');
    const thenNodes = args[1]; // raw node array
    const elseNodes = args[2]; // raw node array (optional)

    if (evaluateCondition(condition)) {
      if (Array.isArray(thenNodes)) return context.executeNodes(thenNodes);
    } else {
      if (Array.isArray(elseNodes)) return context.executeNodes(elseNodes);
    }

    return '';
  },
};
