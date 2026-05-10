'use strict';

const vm = require('vm');

const EVAL_TIMEOUT = 1000; // ms

// $eval[expression]
// Evaluates a JavaScript expression safely and returns the result.
// Only basic JS is available — no require, no fs, no network.
module.exports = async (context, args) => {
  const expr = String(args[0] || '');
  if (!expr) return '';

  const sandbox = {
    Math,
    parseInt,
    parseFloat,
    String,
    Number,
    Boolean,
    Array,
    Object,
    JSON,
    Date,
    isNaN,
    isFinite,
    Infinity,
    NaN,
    undefined,
  };

  vm.createContext(sandbox);

  try {
    const result = vm.runInContext(expr, sandbox, {
      timeout: EVAL_TIMEOUT,
      displayErrors: false,
    });
    return result === null || result === undefined ? '' : String(result);
  } catch (err) {
    return `[eval error: ${err.message}]`;
  }
};
