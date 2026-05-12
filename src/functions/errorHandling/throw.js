'use strict';

const fnError = require('../../core/fnError');

// $throw[message;tip?]
// Emits a rich formatted error, stores it in __lastError__, and halts execution.
module.exports = async (context, args) => {
  const message = String(args[0] !== undefined ? args[0] : 'An error occurred').trim();
  const tip     = args[1] !== undefined ? String(args[1]).trim() : undefined;

  context.variables.set('__lastError__', message);
  context.stop();

  return fnError('throw', message, {
    ...(tip ? { tip } : {}),
    example: '$throw[Something went wrong]',
  });
};
