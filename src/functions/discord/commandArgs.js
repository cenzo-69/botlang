'use strict';

// $commandargs              → all command args joined by a space
// $commandargs[sep]         → all command args joined by sep
//
// For index-based access use $arg[n] or $message[n].
// For slash commands, args are the option values in declaration order.
//
// Examples — user types "!say hello beautiful world":
//   $commandargs         → "hello beautiful world"
//   $commandargs[, ]     → "hello, beautiful, world"
//   $commandargs[-]      → "hello-beautiful-world"
module.exports = async (context, args) => {
  const parts = context.commandArgs;
  if (!parts || !parts.length) return '';

  const sep = args[0] !== undefined ? String(args[0]) : ' ';
  return parts.join(sep);
};
