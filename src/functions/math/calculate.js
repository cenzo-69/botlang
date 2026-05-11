'use strict';

// $calculate[expression]  — evaluate a math expression (alias for $math)
// Supports: + - * / % ^ () and standard operator precedence.
// Example: $calculate[2 * (3 + 4)]  → 14
module.exports = async (context, args) => {
  const expr = (args[0] || '').trim();
  if (!expr) return '[calculate error: empty expression]';

  try {
    // Safe evaluation: only allow numbers and math operators/parens/spaces
    if (!/^[\d\s+\-*/%.^()]+$/.test(expr)) {
      return '[calculate error: invalid characters in expression]';
    }
    // Replace ^ with ** for exponentiation
    const safe = expr.replace(/\^/g, '**');
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + safe + ')')();
    if (typeof result !== 'number' || !isFinite(result)) return '[calculate error: invalid result]';
    return String(Number.isInteger(result) ? result : parseFloat(result.toFixed(10)));
  } catch {
    return '[calculate error: invalid expression]';
  }
};
