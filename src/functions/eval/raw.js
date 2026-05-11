'use strict';

// $raw[code]
// Returns the source text of the argument WITHOUT evaluating any $functions.
// The arg is LAZY — it receives raw AST nodes instead of a resolved string.
// This is useful to display framework syntax as literal text.

function nodesToSource(nodes) {
  if (!Array.isArray(nodes)) return String(nodes ?? '');
  return nodes.map(node => {
    if (node.type === 'text') return node.value;
    if (node.type === 'function') {
      const name = node.originalName || node.name;
      if (node.args === null) return `$${name}`;
      const argParts = node.args.map(argNodes => nodesToSource(argNodes));
      return `$${name}[${argParts.join(';')}]`;
    }
    return '';
  }).join('');
}

module.exports = {
  lazy: [0],

  execute: async (context, args) => {
    return nodesToSource(args[0]);
  },
};
