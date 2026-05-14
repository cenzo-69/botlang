'use strict';

const { argError } = require('../../core/fnError');

// $await[blockName]
// Executes the named async block previously stored by $async[name].
// The block source is stored in __async_block_<name>__ as a script string.
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);

  const code = context.variables.get(`__async_block_${name}__`);
  if (!code) return `[error: $await — block "${name}" not found]`;

  try {
    const { Interpreter } = require('../../../src/core/Interpreter');
    const child = context.child();
    const interp = new Interpreter(context.loader, context.client);
    return await interp.run(code, child);
  } catch (err) {
    return `[error: $await — ${err.message}]`;
  }
};
