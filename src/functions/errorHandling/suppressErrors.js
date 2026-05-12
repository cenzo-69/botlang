'use strict';

// $suppressErrors[code]
// Executes `code` and silences all formatted errors and thrown exceptions.
// Returns the clean output, or empty string on failure.
// Arg 0 is LAZY.
module.exports = {
  lazy: [0],

  execute: async (context, args) => {
    const bodyNodes = args[0];
    if (!Array.isArray(bodyNodes)) return '';

    try {
      const result = await context.child().executeNodes(bodyNodes);
      // Strip all formatted error blocks from output
      return String(result)
        .replace(/⛔[^\n]*\n?(?:┌[^\n]*\n?(?:│[^\n]*\n?)*└[^\n]*\n?)?/g, '')
        .replace(/\[error:[^\]]*\]/gi, '')
        .trim();
    } catch {
      return '';
    }
  },
};
