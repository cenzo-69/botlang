'use strict';

const { argError } = require('../../core/fnError');

// $httpPatch[url;body;headers?]
// Sends an HTTP PATCH request and returns the response body.
module.exports = async (context, args) => {
  const url     = String(args[0] !== undefined ? args[0] : '').trim();
  const body    = String(args[1] !== undefined ? args[1] : '');
  const headers = String(args[2] !== undefined ? args[2] : '').trim();
  if (!url) return argError(context, 'url', 'URL', url);

  const ctxHeaders = context.variables.get('__http_headers__') || {};
  const headersObj = { 'Content-Type': 'application/json', ...ctxHeaders };
  if (headers) {
    try { Object.assign(headersObj, JSON.parse(headers)); }
    catch { return '[error: Invalid headers JSON!]'; }
  }

  try {
    const res  = await fetch(url, { method: 'PATCH', headers: headersObj, body });
    const text = await res.text();
    context.variables.set('__http_response__', text);
    context.variables.set('__http_status__', String(res.status));
    return text;
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
