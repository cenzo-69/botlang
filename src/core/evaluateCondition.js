'use strict';

/**
 * Shared condition evaluator used by $if, $onlyIf, $while, etc.
 *
 * Supported operators (checked in order to handle >= before >):
 *   >=  <=  !=  ==  >  <
 *
 * Fallback: plain truthy check
 *   false when: empty string, "0", "false"
 *   true  for everything else
 */
function evaluateCondition(condition) {
  const OPS = [
    { op: '>=', fn: (a, b) => toNum(a) >= toNum(b) },
    { op: '<=', fn: (a, b) => toNum(a) <= toNum(b) },
    { op: '!=', fn: (a, b) => a.trim() !== b.trim() },
    { op: '==', fn: (a, b) => a.trim() === b.trim() },
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

  const v = condition.trim().toLowerCase();
  return v !== '' && v !== '0' && v !== 'false';
}

function toNum(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

module.exports = evaluateCondition;
