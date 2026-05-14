'use strict';

const { argError } = require('../../core/fnError');

// $httpAddHeader[name;value]
// Adds a persistent header that will be included in all subsequent HTTP requests.
module.exports = async (context, args) => {
  const name  = String(args[0] !== undefined ? args[0] : '').trim();
  const value = String(args[1] !== undefined ? args[1] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);

  const headers = context.variables.get('__http_headers__') || {};
  headers[name] = value;
  context.variables.set('__http_headers__', headers);
  return '';
};
