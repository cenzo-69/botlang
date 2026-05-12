'use strict';

// $httpPost[url;body;headers?]
// Sends an HTTP POST request with a body and returns the response body.
// body    — string body (JSON, form-encoded, etc.)
// headers — optional JSON string of key-value pairs.
module.exports = async (context, args) => {
  const url     = String(args[0] !== undefined ? args[0] : '').trim();
  const body    = String(args[1] !== undefined ? args[1] : '');
  const headers = String(args[2] !== undefined ? args[2] : '').trim();

  if (!url) return '[error: $httpPost requires a URL]';

  let headersObj = { 'Content-Type': 'application/json' };
  if (headers) {
    try { headersObj = { ...headersObj, ...JSON.parse(headers) }; }
    catch { return '[error: $httpPost — invalid headers JSON]'; }
  }

  try {
    const res  = await fetch(url, { method: 'POST', headers: headersObj, body });
    const text = await res.text();
    context.variables.set('__http_response__', text);
    context.variables.set('__http_status__', String(res.status));
    return text;
  } catch (err) {
    return `[error: $httpPost — ${err.message}]`;
  }
};
