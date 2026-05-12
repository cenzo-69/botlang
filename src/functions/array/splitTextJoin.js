'use strict';
// $splitTextJoin[separator]  — joins __textsplit__ array back with separator
module.exports = async (context, args) => {
  const sep = args[0] !== undefined ? String(args[0]) : ',';
  const raw = context.variables.get('__textsplit__');
  if (!raw) return '[error: $splitTextJoin — no $textSplit has been called yet]';
  try { return JSON.parse(raw).join(sep); }
  catch { return '[error: $splitTextJoin — corrupted split data]'; }
};
