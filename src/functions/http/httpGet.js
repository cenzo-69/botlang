'use strict';

// $httpGet[url;headers?]
// Sends an HTTP GET request. Returns the response body.
// Also stores response in __http_response__ and status code in __http_status__.
// Merges headers from $httpAddHeader with any inline headers arg.
module.exports = async (context, args) => {
  const url     = String(args[0] !== undefined ? args[0] : '').trim();
  const headers = String(args[1] !== undefined ? args[1] : '').trim();
  if (!url) return '[error: $httpGet requires a URL]';

  const ctxHeaders = context.variables.get('__http_headers__') || {};
  const headersObj = { ...ctxHeaders };
  if (headers) {
    try { Object.assign(headersObj, JSON.parse(headers)); }
    catch { return '[error: $httpGet — invalid headers JSON]'; }
  }

  try {
    const res  = await fetch(url, { headers: headersObj });
    const text = await res.text();
    context.variables.set('__http_response__', text);
    context.variables.set('__http_status__', String(res.status));
    return text;
  } catch (err) {
    return `[error: $httpGet — ${err.message}]`;
  }
};
