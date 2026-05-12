'use strict';

const fnError = require('../../core/fnError');

// $calculate[expression]  — evaluate a math expression (alias for $math)
// Supports: + - * / % ^ () and standard operator precedence
module.exports = async (context, args) => {
  const expr = String(args[0] !== undefined ? args[0] : '').trim();

  if (!expr) {
    return fnError('calculate', 'expression is empty', {
      expected: 'a valid math expression',
      example:  '$calculate[2 * (3 + 4)]',
    });
  }

  if (!/^[\d\s+\-*/%.^()]+$/.test(expr)) {
    return fnError('calculate', 'expression contains invalid characters', {
      got:      expr,
      expected: 'numbers and operators only: `+ - * / % ^ ( )`',
      example:  '$calculate[10 / 2 + 3]',
    });
  }

  try {
    const safe   = expr.replace(/\^/g, '**');
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + safe + ')')();
    if (typeof result !== 'number' || !isFinite(result)) {
      return fnError('calculate', 'expression produced an invalid result', {
        got:     String(result),
        tip:     'Check for division by zero or overflow',
        example: '$calculate[10 / 2]',
      });
    }
    return String(Number.isInteger(result) ? result : parseFloat(result.toFixed(10)));
  } catch (err) {
    return fnError('calculate', 'could not evaluate expression', {
      got:     expr,
      tip:     err.message,
      example: '$calculate[2 + 2]',
    });
  }
};
