'use strict';
const parseTime = require('../../core/parseTime');
// $setInterval[code;duration;name?]  — executes code repeatedly at given interval
// The code arg is LAZY. Duration uses s/h/d format.
const activeIntervals = new Map();
module.exports = {
  lazy: [0],
  execute: async (context, args) => {
    const codeNodes = args[0];
    const ms        = parseTime(args[1]);
    const name      = args[2] !== undefined ? String(args[2]).trim() : String(Date.now());
    if (!ms) return '[error: $setInterval — invalid duration. Usage: $setInterval[code;30s;myLoop]]';
    if (!Array.isArray(codeNodes)) return '[error: $setInterval — code block is required]';
    if (name && activeIntervals.has(name)) {
      clearInterval(activeIntervals.get(name));
    }
    const handle = setInterval(async () => {
      try { await context.child().executeNodes(codeNodes); } catch {}
    }, ms);
    if (name) activeIntervals.set(name, handle);
    return '';
  },
  _store: activeIntervals,
};
