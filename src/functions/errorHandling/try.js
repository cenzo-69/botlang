'use strict';

// $try[code;fallback;errorVar?]
// Executes `code` lazily. On any error or [error: ...] output, runs `fallback`.
// If errorVar is given, stores the error message in that variable.
// All args are LAZY.
module.exports = {
  lazy: [0, 1, 2],

  execute: async (context, args) => {
    const tryNodes      = args[0];
    const fallbackNodes = args[1];
    const errorVarNodes = args[2];

    if (!Array.isArray(tryNodes)) return '';

    const storeError = async (msg) => {
      if (Array.isArray(errorVarNodes)) {
        const varName = await context.child().executeNodes(errorVarNodes);
        if (varName) context.variables.set(varName, msg);
      }
    };

    try {
      const result = await context.child().executeNodes(tryNodes);

      // Treat [error: ...] returns as failures
      if (typeof result === 'string' && /^\[error:/i.test(result)) {
        const errMsg = result.replace(/^\[error:\s*/i, '').replace(/\]$/, '');
        await storeError(errMsg);
        if (Array.isArray(fallbackNodes)) {
          return context.child().executeNodes(fallbackNodes);
        }
        return '';
      }

      return result;
    } catch (err) {
      await storeError(err.message || String(err));
      if (Array.isArray(fallbackNodes)) {
        return context.child().executeNodes(fallbackNodes);
      }
      return '';
    }
  },
};
