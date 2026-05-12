'use strict';
// $jsonFromEntries[entries;separator?;kvSeparator?]  — builds a JSON object from key=value pairs
module.exports = async (context, args) => {
  const entries   = String(args[0] !== undefined ? args[0] : '');
  const sep       = String(args[1] !== undefined ? args[1] : ',');
  const kvSep     = String(args[2] !== undefined ? args[2] : '=');
  if (!entries) return '{}';
  const obj = {};
  for (const entry of entries.split(sep)) {
    const idx = entry.indexOf(kvSep);
    if (idx === -1) continue;
    const k = entry.slice(0, idx).trim();
    const v = entry.slice(idx + kvSep.length).trim();
    try { obj[k] = JSON.parse(v); } catch { obj[k] = v; }
  }
  return JSON.stringify(obj);
};
