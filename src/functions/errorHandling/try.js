'use strict';

// $try[code;fallback;errorVar?]
// Executes `code` lazily. On any error or formatted error output, runs `fallback`.
// If errorVar is given, stores the error message in that session variable.
// All args are LAZY.
module.exports = {
  lazy: [0, 1, 2],

  execute: async (context, args) => {
    const tryNodes      = args[0];
    const fallbackNodes = args[1];
    const errorVarNodes = args[2];

    if (!Array.isArray(tryNodes)) return '';

    const storeError = async (msg) => {
      // Store clean message without formatting
      const clean = msg.replace(/⛔[^\n]*\n?(?:┌[^\n]*\n?(?:│[^\n]*\n?)*└[^\n]*\n?)?/g, '').trim()
                      .replace(/\[error:[^\]]*\]/gi, '').trim() || msg;
      context.variables.set('__lastError__', clean);
      if (Array.isArray(errorVarNodes)) {
        const varName = await context.child().executeNodes(errorVarNodes);
        if (varName) context.variables.set(String(varName).toLowerCase(), clean);
      }
    };

    try {
      const result = await context.child().executeNodes(tryNodes);

      // Treat formatted errors or [error: ...] returns as failures
      const hasError = typeof result === 'string' && (
        /^⛔/.test(result) || /^\[error:/i.test(result)
      );

      if (hasError) {
        const errMsg = result
          .replace(/^⛔[^\n]*\n?/, '').replace(/┌[^\n]*\n?(?:│[^\n]*\n?)*└[^\n]*\n?/g, '')
          .replace(/^\[error:\s*/i, '').replace(/\]$/, '').trim() || result;
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
