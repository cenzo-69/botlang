'use strict';
const parseTime = require('../../core/parseTime');
// $setTimeout[code;duration;name?]  — executes code lazily after a delay
// The code arg is LAZY. Duration uses s/h/d format.
const activeTimeouts = new Map();
module.exports = {
  lazy: [0],
  execute: async (context, args) => {
    const codeNodes = args[0];
    const ms        = parseTime(args[1]);
    const name      = args[2] !== undefined ? String(args[2]).trim() : String(Date.now());
    if (!ms) return '[error: $setTimeout — invalid duration. Usage: $setTimeout[code;5s;myTimer]]';
    if (!Array.isArray(codeNodes)) return '[error: $setTimeout — code block is required]';
    const handle = setTimeout(async () => {
      activeTimeouts.delete(name);
      try { await context.child().executeNodes(codeNodes); } catch {}
    }, ms);
    if (name) activeTimeouts.set(name, handle);
    return '';
  },
  _store: activeTimeouts,
};
