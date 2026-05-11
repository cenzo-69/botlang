'use strict';

// $httpDelete[url;headers?]
// Sends an HTTP DELETE request and returns the response body.
module.exports = async (context, args) => {
  const url     = String(args[0] !== undefined ? args[0] : '').trim();
  const headers = String(args[1] !== undefined ? args[1] : '').trim();

  if (!url) return '[error: $httpDelete requires a URL]';

  let headersObj = {};
  if (headers) {
    try { headersObj = JSON.parse(headers); } catch { return '[error: $httpDelete — invalid headers JSON]'; }
  }

  try {
    const res  = await fetch(url, { method: 'DELETE', headers: headersObj });
    const text = await res.text();
    return text;
  } catch (err) {
    return `[error: $httpDelete — ${err.message}]`;
  }
};
