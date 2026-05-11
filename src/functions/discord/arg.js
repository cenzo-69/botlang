'use strict';

// $arg[index]  → Nth word of the command input (1-based)
//
// Alias for $message[index]. Use whichever reads more naturally.
//
// Examples — user types "!ban @User spamming":
//   $arg[1]  → "@User"   (raw mention string from input)
//   $arg[2]  → "spamming"
//   $arg[99] → ""  (out of range → empty string, not an error)
module.exports = async (context, args) => {
  const index = parseInt(args[0]);
  if (isNaN(index) || index < 1) return '';

  const input = context.commandInput;
  if (!input) return '';

  const parts = input.trim().split(/\s+/);
  return parts[index - 1] !== undefined ? parts[index - 1] : '';
};
