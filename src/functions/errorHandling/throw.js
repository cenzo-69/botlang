'use strict';

// $throw[message]
// Produces an [error: message] string and stops execution.
// Useful for explicit error signalling inside $try blocks.
module.exports = async (context, args) => {
  const message = String(args[0] !== undefined ? args[0] : 'error');
  context.stop();
  return `[error: ${message}]`;
};
