'use strict';

// $suppressErrors[code]
// Executes `code` and silences all [error: ...] output and thrown exceptions.
// Returns the clean output, or empty string on failure.
// Arg 0 is LAZY.
module.exports = {
  lazy: [0],

  execute: async (context, args) => {
    const bodyNodes = args[0];
    if (!Array.isArray(bodyNodes)) return '';

    try {
      const result = await context.child().executeNodes(bodyNodes);
      // Strip all [error: ...] segments from output
      return String(result).replace(/\[error:[^\]]*\]/gi, '').trim();
    } catch (err) {
      // Silently swallow any thrown errors
      return '';
    }
  },
};
