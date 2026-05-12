'use strict';
// $arrayReduce[variable;itemVar;accVar;code;initial?]  — reduces array to single value
module.exports = {
  lazy: [1, 2, 3],
  execute: async (context, args) => {
    const name       = String(args[0] !== undefined ? args[0] : '').trim();
    const varNodes   = args[1];
    const accNodes   = args[2];
    const codeNodes  = args[3];
    const initial    = args[4] !== undefined ? String(args[4]) : '0';
    if (!name) return '[error: $arrayReduce — variable name is required]';
    const raw = context.variables.get(`__array_${name}__`);
    if (!raw) return `[error: $arrayReduce — array "${name}" does not exist]`;
    let arr;
    try { arr = JSON.parse(raw); } catch { return '[error: $arrayReduce — corrupted array data]'; }
    const itemVar = Array.isArray(varNodes) ? await context.child().executeNodes(varNodes) : String(varNodes);
    const accVar  = Array.isArray(accNodes)  ? await context.child().executeNodes(accNodes)  : String(accNodes);
    let acc = initial;
    for (const item of arr) {
      const child = context.child();
      child.variables.set(itemVar, String(item ?? ''));
      child.variables.set(accVar, acc);
      if (Array.isArray(codeNodes)) acc = await child.executeNodes(codeNodes);
    }
    return acc;
  },
};
