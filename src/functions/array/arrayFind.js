'use strict';

const { argError } = require('../../core/fnError');
// $arrayFind[variable;itemVar;condition]  — finds first element matching condition
module.exports = {
  lazy: [1, 2],
  execute: async (context, args) => {
    const name      = String(args[0] !== undefined ? args[0] : '').trim();
    const varNodes  = args[1];
    const condNodes = args[2];
    if (!name) return argError(context, 'name', 'string', name);
    const raw = context.variables.get(`__array_${name}__`);
    if (!raw) return `[error: Array "${name}" does not exist!]`;
    let arr;
    try { arr = JSON.parse(raw); } catch { return '[error: Corrupted array data!]'; }
    const itemVar = Array.isArray(varNodes) ? await context.child().executeNodes(varNodes) : String(varNodes);
    for (const item of arr) {
      const child = context.child();
      child.variables.set(itemVar, String(item ?? ''));
      if (!Array.isArray(condNodes)) continue;
      const result = await child.executeNodes(condNodes);
      if (result === 'true' || result === '1') return String(item ?? '');
    }
    return '';
  },
};
