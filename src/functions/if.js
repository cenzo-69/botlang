'use strict';

// $if[condition;thenCode;elseCode]
//
// Condition formats:
//   value==value   value!=value
//   value>value    value<value
//   value>=value   value<=value
//   value          (truthy check: non-empty, non-zero, not "false")
//
// thenCode and elseCode are LAZY — only the matching branch is executed.
module.exports = {
  lazy: [1, 2],

  execute: async (context, args) => {
    const condition = String(args[0] || '');
    const thenNodes = args[1]; // raw nodes
    const elseNodes = args[2]; // raw nodes (optional)

    const passed = evaluateCondition(condition);

    if (passed) {
      if (Array.isArray(thenNodes)) return context.executeNodes(thenNodes);
    } else {
      if (Array.isArray(elseNodes)) return context.executeNodes(elseNodes);
    }

    return '';
  },
};

function evaluateCondition(condition) {
  // Try operator-based comparison
  const OPS = [
    { op: '>=', fn: (a, b) => toNum(a) >= toNum(b) },
    { op: '<=', fn: (a, b) => toNum(a) <= toNum(b) },
    { op: '!=', fn: (a, b) => a !== b },
    { op: '==', fn: (a, b) => a === b },
    { op: '>',  fn: (a, b) => toNum(a) >  toNum(b) },
    { op: '<',  fn: (a, b) => toNum(a) <  toNum(b) },
  ];

  for (const { op, fn } of OPS) {
    const idx = condition.indexOf(op);
    if (idx !== -1) {
      const left  = condition.slice(0, idx).trim();
      const right = condition.slice(idx + op.length).trim();
      return fn(left, right);
    }
  }

  // Plain truthy check
  const v = condition.trim().toLowerCase();
  return v !== '' && v !== '0' && v !== 'false';
}

function toNum(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}
