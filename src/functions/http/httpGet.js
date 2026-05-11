'use strict';

// $httpGet[url;headers?]
// Sends an HTTP GET request and returns the response body as a string.
// headers — optional JSON string of key-value pairs.
// Uses the built-in fetch (Node 18+).
module.exports = async (context, args) => {
  const url     = String(args[0] !== undefined ? args[0] : '').trim();
  const headers = String(args[1] !== undefined ? args[1] : '').trim();

  if (!url) return '[error: $httpGet requires a URL]';

  let headersObj = {};
  if (headers) {
    try { headersObj = JSON.parse(headers); } catch { return '[error: $httpGet — invalid headers JSON]'; }
  }

  try {
    const res  = await fetch(url, { headers: headersObj });
    const text = await res.text();
    return text;
  } catch (err) {
    return `[error: $httpGet — ${err.message}]`;
  }
};
