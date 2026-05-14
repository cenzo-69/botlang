'use strict';

const { argError } = require('../../core/fnError');

// $httpRemoveHeader[name]
// Removes a previously added header from the persistent HTTP header store.
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);

  const headers = context.variables.get('__http_headers__') || {};
  delete headers[name];
  context.variables.set('__http_headers__', headers);
  return '';
};
