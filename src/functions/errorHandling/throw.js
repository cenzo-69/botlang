'use strict';

// $throw[message;code?]
// Emits a detailed error string and stops execution.
// Optional code arg provides extra context (function name, usage info, etc).
module.exports = async (context, args) => {
  const message = String(args[0] !== undefined ? args[0] : 'An error occurred');
  const code    = args[1] !== undefined ? ` (${args[1]})` : '';
  context.stop();
  return `[error: ${message}${code}]`;
};
