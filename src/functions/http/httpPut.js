'use strict';

// $httpPut[url;body;headers?]
// Sends an HTTP PUT request with a body and returns the response body.
module.exports = async (context, args) => {
  const url     = String(args[0] !== undefined ? args[0] : '').trim();
  const body    = String(args[1] !== undefined ? args[1] : '');
  const headers = String(args[2] !== undefined ? args[2] : '').trim();

  if (!url) return '[error: $httpPut requires a URL]';

  let headersObj = { 'Content-Type': 'application/json' };
  if (headers) {
    try { headersObj = { ...headersObj, ...JSON.parse(headers) }; }
    catch { return '[error: $httpPut — invalid headers JSON]'; }
  }

  try {
    const res  = await fetch(url, { method: 'PUT', headers: headersObj, body });
    const text = await res.text();
    return text;
  } catch (err) {
    return `[error: $httpPut — ${err.message}]`;
  }
};
