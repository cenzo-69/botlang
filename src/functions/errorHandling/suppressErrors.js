'use strict';

// $suppressErrors[code]
// Executes `code` and strips any [error: ...] strings from the output.
// Execution errors (thrown exceptions) are also silenced — returns empty string.
// The arg is LAZY.
module.exports = {
  lazy: [0],

  execute: async (context, args) => {
    const bodyNodes = args[0];
    if (!Array.isArray(bodyNodes)) return '';

    try {
      const result = await context.child().executeNodes(bodyNodes);
      return result.replace(/\[error:[^\]]*\]/g, '').trim();
    } catch {
      return '';
    }
  },
};
