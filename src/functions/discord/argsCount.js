'use strict';

// $argsCount  → number of space-separated words in the command input
//
// Examples:
//   "!ping"             → $argsCount → "0"
//   "!say hello"        → $argsCount → "1"
//   "!say hello world"  → $argsCount → "2"
//
// Use with $onlyIf to enforce required arguments:
//   $onlyIf[$argsCount>=1]
//   You provided: $message
module.exports = async (context) => {
  const input = context.commandInput;
  if (!input || !input.trim()) return '0';
  return String(input.trim().split(/\s+/).filter(Boolean).length);
};
