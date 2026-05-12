'use strict';
// $typeof[value]  — returns the JavaScript type of a value
module.exports = async (context, args) => {
  const val = args[0];
  if (val === undefined) return 'undefined';
  const s = String(val);
  if (s === 'true' || s === 'false') return 'boolean';
  if (!isNaN(Number(s)) && s.trim() !== '') return 'number';
  if (s.startsWith('{') || s.startsWith('[')) {
    try { JSON.parse(s); return typeof JSON.parse(s); } catch {}
  }
  return 'string';
};
