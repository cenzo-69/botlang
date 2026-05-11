'use strict';

// $message              → full command input (everything after the command name)
// $message[index]       → the Nth word of the input (1-based)
//
// Populated by Runtime.runForCommand().
// Returns '' when called via runForMessage() (no command context).
//
// Examples — user types "!say hello world":
//   $message       → "hello world"
//   $message[1]    → "hello"
//   $message[2]    → "world"
//   $message[99]   → ""     (out of range)
//
// Primary use case:
//   Command code: $eval[$message]
//   User types:   !eval $upper[hello]
//   $message  →   "$upper[hello]"
//   $eval runs "$upper[hello]" through the parser  →  "HELLO"
module.exports = async (context, args) => {
  const input = context.commandInput;
  if (!input) return '';

  const indexStr = args[0];
  if (indexStr !== undefined && indexStr !== '') {
    const index = parseInt(indexStr);
    if (!isNaN(index) && index >= 1) {
      const parts = input.trim().split(/\s+/);
      return parts[index - 1] !== undefined ? parts[index - 1] : '';
    }
  }

  return input;
};
