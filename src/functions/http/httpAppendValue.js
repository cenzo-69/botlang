'use strict';

const { argError } = require('../../core/fnError');
// $httpAppendValue[jsonPath;value]  — appends a value to a JSON path in the HTTP body
module.exports = async (context, args) => {
  const path  = String(args[0] !== undefined ? args[0] : '').trim();
  const value = args[1] !== undefined ? args[1] : null;
  if (!path) return argError(context, 'path', 'string', path);
  const raw = context.variables.get('__http_body__') || '{}';
  try {
    const obj   = JSON.parse(raw);
    const keys  = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    const lastKey = keys[keys.length - 1];
    if (Array.isArray(current[lastKey])) current[lastKey].push(value);
    else current[lastKey] = value;
    context.variables.set('__http_body__', JSON.stringify(obj));
    return '';
  } catch (err) { return `[error: $httpAppendValue — ${err.message}]`; }
};
