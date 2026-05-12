'use strict';
// $httpPing[url]  — returns the response time in ms for a URL, or error
module.exports = async (context, args) => {
  const url = String(args[0] !== undefined ? args[0] : '').trim();
  if (!url) return '[error: $httpPing — url is required]';
  try {
    const start = Date.now();
    const resp  = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(10000) });
    return String(Date.now() - start);
  } catch (err) { return `[error: $httpPing — ${err.message}]`; }
};
