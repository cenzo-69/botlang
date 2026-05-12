'use strict';
// $arrayForEach[variable;itemVar;code]  — iterate over array, stores each element in itemVar
// Args 1 (itemVar) and 2 (code) are lazy
module.exports = {
  lazy: [1, 2],
  execute: async (context, args) => {
    const name      = String(args[0] !== undefined ? args[0] : '').trim();
    const varNodes  = args[1];
    const codeNodes = args[2];
    if (!name) return '[error: $arrayForEach — variable name is required]';
    const raw = context.variables.get(`__array_${name}__`);
    if (!raw) return `[error: $arrayForEach — array "${name}" does not exist]`;
    let arr;
    try { arr = JSON.parse(raw); } catch { return '[error: $arrayForEach — corrupted array data]'; }
    const itemVar = Array.isArray(varNodes) ? await context.child().executeNodes(varNodes) : String(varNodes);
    const results = [];
    for (const item of arr) {
      const child = context.child();
      child.variables.set(itemVar, String(item ?? ''));
      if (Array.isArray(codeNodes)) results.push(await child.executeNodes(codeNodes));
    }
    return results.join('');
  },
};
