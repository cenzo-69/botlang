'use strict';

const { argError } = require('../../core/fnError');
// $arrayFilter[variable;itemVar;condition;outputVar?]  — filters array by condition
module.exports = {
  lazy: [1, 2],
  execute: async (context, args) => {
    const name   = String(args[0] !== undefined ? args[0] : '').trim();
    const varNodes  = args[1];
    const condNodes = args[2];
    const outVar = args[3] !== undefined ? String(args[3]).trim() : '';
    if (!name) return argError(context, 'name', 'string', name);
    const raw = context.variables.get(`__array_${name}__`);
    if (!raw) return `[error: $arrayFilter — array "${name}" does not exist]`;
    let arr;
    try { arr = JSON.parse(raw); } catch { return '[error: $arrayFilter — corrupted array data]'; }
    const itemVar = Array.isArray(varNodes) ? await context.child().executeNodes(varNodes) : String(varNodes);
    const filtered = [];
    for (const item of arr) {
      const child = context.child();
      child.variables.set(itemVar, String(item ?? ''));
      if (!Array.isArray(condNodes)) continue;
      const result = await child.executeNodes(condNodes);
      if (result === 'true' || result === '1') filtered.push(item);
    }
    const target = outVar || name;
    context.variables.set(`__array_${target}__`, JSON.stringify(filtered));
    return JSON.stringify(filtered);
  },
};
