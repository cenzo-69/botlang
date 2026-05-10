'use strict';

// $noMentionMessage              → command input with all Discord mentions stripped
// $noMentionMessage[index]       → Nth word of the cleaned input (1-based)
//
// Stripped patterns: <@12345>  <@!12345>  <#12345>  <@&12345>
//
// Examples — user types "!say @Cenzo hello world":
//   $noMentionMessage      → "hello world"
//   $noMentionMessage[1]   → "hello"
//   $noMentionMessage[2]   → "world"
//
// Useful for $say, $announce, and any command that should echo user text
// without leaking raw mention syntax into the output.
module.exports = async (context, args) => {
  const input = context.noMentionInput;
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
