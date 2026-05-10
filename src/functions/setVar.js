'use strict';

// $setVar[name;value]
//
// Sets a session-scoped variable. Explicit alias for $var[name;value].
// Use $setVar when clarity matters — e.g. in longer scripts where you want
// writes to stand out from reads ($getVar).
//
// Variables are:
//   - case-insensitive (stored lowercase)
//   - scoped to the current execution (not persistent across commands)
//   - shared across all nested function calls in the same execution
//
// Example:
//   $setVar[score;0]
//   $loop[5;$setVar[score;$math[$getVar[score]+10]]]
//   Final score: $getVar[score]   → "Final score: 50"
module.exports = async (context, args) => {
  const name  = args[0];
  const value = args[1] !== undefined ? args[1] : '';
  if (!name) return '';
  context.setVariable(name, value);
  return '';
};
