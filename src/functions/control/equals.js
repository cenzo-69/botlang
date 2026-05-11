'use strict';

// $equals[a;b]            → true | false
// $equals[a;b;then;else]  → then or else branch (lazy)
module.exports = {
  lazy: [2, 3],

  execute: async (context, args) => {
    const a = String(args[0] || '');
    const b = String(args[1] || '');
    const equal = a === b;

    const thenNodes = args[2];
    const elseNodes = args[3];

    if (!Array.isArray(thenNodes) && !Array.isArray(elseNodes)) {
      return String(equal);
    }

    if (equal && Array.isArray(thenNodes)) return context.executeNodes(thenNodes);
    if (!equal && Array.isArray(elseNodes)) return context.executeNodes(elseNodes);
    return '';
  },
};
