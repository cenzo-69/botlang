'use strict';

const vm = require('vm');

const EVAL_TIMEOUT = 3000;

// $evalDJS[code]
// Evaluates JavaScript with full discord.js access.
// WARNING: This is a powerful/dangerous function — restrict to bot owners.
module.exports = async (context, args) => {
  const code = String(args[0] || '');
  if (!code) return '';

  const sandbox = {
    message: context.message,
    client: context.client,
    channel: context.message?.channel,
    guild: context.message?.guild,
    author: context.message?.author,
    Math,
    parseInt,
    parseFloat,
    String,
    Number,
    Boolean,
    JSON,
    Date,
    console,
    require,
    Promise,
    setTimeout,
    clearTimeout,
    result: undefined,
  };

  vm.createContext(sandbox);

  try {
    const wrapped = `(async () => { ${code} })()`;
    const promise = vm.runInContext(wrapped, sandbox, {
      timeout: EVAL_TIMEOUT,
      displayErrors: false,
    });
    const result = await promise;
    return result === null || result === undefined ? '' : String(result);
  } catch (err) {
    return `[evalDJS error: ${err.message}]`;
  }
};
