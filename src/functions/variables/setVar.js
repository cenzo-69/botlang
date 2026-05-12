'use strict';

const fnError = require('../../core/fnError');

// $setVar[name;value]  — sets a session-scoped variable (lives for this execution only)
module.exports = async (context, args) => {
  const name  = String(args[0] !== undefined ? args[0] : '').trim();
  const value = args[1] !== undefined ? String(args[1]) : '';

  if (!name) {
    return fnError('setVar', 'variable name is required', {
      expected: '`name` (string), `value` (any)',
      example:  '$setVar[score;100]',
    });
  }

  context.setVariable(name, value);
  return '';
};
