'use strict';

const fnError = require('../../core/fnError');

// $var[name]          — get a session variable (returns '' if not set)
// $var[name;value]    — set a session variable and return ''
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();

  if (!name) {
    return fnError('var', 'variable name is required', {
      expected: '`string` (variable name)',
      example:  '$var[score]  or  $var[score;100]',
    });
  }

  // Setter form: $var[name;value]
  if (args[1] !== undefined) {
    const value = String(args[1]);
    context.setVariable(name, value);
    return '';
  }

  // Getter form: $var[name]
  const value = context.getVariable(name);
  return (value !== undefined && value !== null) ? String(value) : '';
};
