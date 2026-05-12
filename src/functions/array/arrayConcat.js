'use strict';
// $arrayConcat[outputVar?;sourceVar1;sourceVar2;...]  — concatenates arrays into outputVar
module.exports = async (context, args) => {
  const outVar  = String(args[0] !== undefined ? args[0] : '').trim();
  const sources = args.slice(1).map(a => String(a).trim()).filter(Boolean);
  if (!sources.length) return '[error: $arrayConcat — at least one source array is required]';
  const combined = [];
  for (const src of sources) {
    const raw = context.variables.get(`__array_${src}__`);
    if (!raw) return `[error: $arrayConcat — array "${src}" does not exist]`;
    try { combined.push(...JSON.parse(raw)); }
    catch { return `[error: $arrayConcat — corrupted array data in "${src}"]`; }
  }
  if (outVar) context.variables.set(`__array_${outVar}__`, JSON.stringify(combined));
  return JSON.stringify(combined);
};
