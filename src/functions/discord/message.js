'use strict';

// $message              → full command input (everything after the command name)
// $message[index]       → the Nth word of the input (1-based, numeric)
// $message[optionName]  → slash command option value by name (string key, slash context only)
//
// Populated by Runtime.runForCommandFull() for prefix commands.
// For slash commands, commandInput is option values joined by space,
// and named options are accessible via $message[optionName].
//
// Examples — user types "!say hello world":
//   $message       → "hello world"
//   $message[1]    → "hello"
//   $message[2]    → "world"
//   $message[99]   → ""     (out of range)
//
// Slash command example with option named "text":
//   $message[text]  → the value of the "text" option
module.exports = async (context, args) => {
  const input = context.commandInput;

  const indexStr = args[0];
  if (indexStr !== undefined && indexStr !== '') {
    const asNum = parseInt(indexStr, 10);

    // Numeric index → Nth word of commandInput
    if (!isNaN(asNum) && String(asNum) === String(indexStr).trim()) {
      if (!input) return '';
      if (asNum >= 1) {
        const parts = input.trim().split(/\s+/);
        return parts[asNum - 1] !== undefined ? parts[asNum - 1] : '';
      }
      return '';
    }

    // String key → look up slash option by name
    const interaction = context.interaction;
    if (interaction?.options) {
      try {
        const opt = interaction.options.get(String(indexStr).trim());
        if (opt !== null && opt !== undefined) return String(opt.value ?? '');
      } catch {}
    }

    // Fallback: treat as word lookup in commandInput
    if (input) {
      const parts = input.trim().split(/\s+/);
      const found = parts.find(p => p.toLowerCase() === String(indexStr).toLowerCase());
      if (found !== undefined) return found;
    }
    return '';
  }

  return input || '';
};
