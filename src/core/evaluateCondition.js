'use strict';

/**
 * Shared condition evaluator used by $if, $onlyIf, $while, etc.
 *
 * Operator precedence (lowest → highest):
 *   ||   — logical OR  (splits into sub-expressions)
 *   &&   — logical AND (splits into sub-expressions)
 *   comparison operators: >= <= != == > <
 *
 * Comparison operators:
 *   >= <= != == > <
 *
 * Fallback truthy check:
 *   false  → empty string, "0", "false"
 *   true   → everything else
 *
 * Examples:
 *   $memberCount>=10
 *   $authorID==$ownerID||$authorID==$coOwnerID
 *   $argsCount>=1&&$message!=hi
 */

function evaluateCondition(condition) {
  if (typeof condition !== 'string') return Boolean(condition);

  const str = condition.trim();

  // ── Split on || (logical OR) ───────────────────────────────────────────────
  // Must not split inside the middle of a string literal — but since CenzoJS
  // args are already resolved, all values are flat strings with no nesting here.
  const orParts = splitOn(str, '||');
  if (orParts.length > 1) {
    return orParts.some(part => evaluateCondition(part.trim()));
  }

  // ── Split on && (logical AND) ─────────────────────────────────────────────
  const andParts = splitOn(str, '&&');
  if (andParts.length > 1) {
    return andParts.every(part => evaluateCondition(part.trim()));
  }

  // ── Comparison operators (ordered so >= is tested before >) ───────────────
  const OPS = [
    { op: '>=', fn: (a, b) => toNum(a) >= toNum(b) },
    { op: '<=', fn: (a, b) => toNum(a) <= toNum(b) },
    { op: '!=', fn: (a, b) => a.trim() !== b.trim() },
    { op: '==', fn: (a, b) => a.trim() === b.trim() },
    { op: '>',  fn: (a, b) => toNum(a) >  toNum(b) },
    { op: '<',  fn: (a, b) => toNum(a) <  toNum(b) },
  ];

  for (const { op, fn } of OPS) {
    const idx = str.indexOf(op);
    if (idx !== -1) {
      const left  = str.slice(0, idx).trim();
      const right = str.slice(idx + op.length).trim();
      return fn(left, right);
    }
  }

  // ── Plain truthy check ────────────────────────────────────────────────────
  const v = str.toLowerCase();
  return v !== '' && v !== '0' && v !== 'false';
}

/**
 * Split string on a delimiter, but only at the top level
 * (does not split if the delimiter is inside brackets — future-proof).
 */
function splitOn(str, delimiter) {
  const parts = [];
  let   depth = 0;
  let   start = 0;
  const dlen  = delimiter.length;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === '[') depth++;
    else if (str[i] === ']') depth--;
    else if (depth === 0 && str.slice(i, i + dlen) === delimiter) {
      parts.push(str.slice(start, i));
      start = i + dlen;
      i    += dlen - 1;
    }
  }
  parts.push(str.slice(start));
  return parts;
}

function toNum(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

module.exports = evaluateCondition;
