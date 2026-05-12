'use strict';
// $scope[code;syncVars?]  — runs code in an isolated child context
// syncVars: comma-separated list of variable names to copy back after execution
module.exports = {
  lazy: [0],
  execute: async (context, args) => {
    const codeNodes = args[0];
    const syncVars  = args[1] !== undefined
      ? String(args[1]).split(',').map(s => s.trim()).filter(Boolean)
      : [];
    if (!Array.isArray(codeNodes)) return '';
    const child  = context.child();
    const result = await child.executeNodes(codeNodes);
    for (const key of syncVars) {
      if (child.variables.has(key)) {
        context.variables.set(key, child.variables.get(key));
      }
    }
    return result ?? '';
  },
};
