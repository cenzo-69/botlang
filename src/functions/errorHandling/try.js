'use strict';

// $try[code;fallback]
// Executes `code` lazily. If it throws an error OR returns an [error:...]
// string, executes `fallback` instead and returns its result.
// Both args are LAZY.
module.exports = {
  lazy: [0, 1],

  execute: async (context, args) => {
    const tryNodes      = args[0];
    const fallbackNodes = args[1];

    if (!Array.isArray(tryNodes)) return '';

    try {
      const result = await context.child().executeNodes(tryNodes);

      // Treat explicit [error: ...] returns as failures too
      if (typeof result === 'string' && result.startsWith('[error:')) {
        if (Array.isArray(fallbackNodes)) {
          return context.child().executeNodes(fallbackNodes);
        }
        return '';
      }

      return result;
    } catch {
      if (Array.isArray(fallbackNodes)) {
        return context.child().executeNodes(fallbackNodes);
      }
      return '';
    }
  },
};
