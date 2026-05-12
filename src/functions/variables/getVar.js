'use strict';

const fnError = require('../../core/fnError');

// $getVar[name]           — returns the session variable's value ('' if unset)
// $getVar[name;default]   — returns fallback if variable is not set
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();

  if (!name) {
    return fnError('getVar', 'variable name is required', {
      expected: '`name` (string)',
      example:  '$getVar[score]  or  $getVar[score;0]',
    });
  }

  const value = context.getVariable(name);
  if (value === undefined || value === null) {
    return args[1] !== undefined ? String(args[1]) : '';
  }
  return String(value);
};
