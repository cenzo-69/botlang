'use strict';
// $arrayMap[variable;itemVar;code;outputVar?]  — maps over array with code, stores result
module.exports = {
  lazy: [1, 2],
  execute: async (context, args) => {
    const name      = String(args[0] !== undefined ? args[0] : '').trim();
    const varNodes  = args[1];
    const codeNodes = args[2];
    const outVar    = args[3] !== undefined ? String(args[3]).trim() : '';
    if (!name) return '[error: $arrayMap — variable name is required]';
    const raw = context.variables.get(`__array_${name}__`);
    if (!raw) return `[error: $arrayMap — array "${name}" does not exist]`;
    let arr;
    try { arr = JSON.parse(raw); } catch { return '[error: $arrayMap — corrupted array data]'; }
    const itemVar = Array.isArray(varNodes) ? await context.child().executeNodes(varNodes) : String(varNodes);
    const mapped = [];
    for (const item of arr) {
      const child = context.child();
      child.variables.set(itemVar, String(item ?? ''));
      mapped.push(Array.isArray(codeNodes) ? await child.executeNodes(codeNodes) : String(item));
    }
    const target = outVar || name;
    context.variables.set(`__array_${target}__`, JSON.stringify(mapped));
    return JSON.stringify(mapped);
  },
};
