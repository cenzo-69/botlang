'use strict';
// $httpGetHeader[headerName]  — returns a response header value from the last HTTP request
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim().toLowerCase();
  if (!name) return '[error: $httpGetHeader — header name is required]';
  const raw = context.variables.get('__http_response_headers__');
  if (!raw) return '';
  try {
    const headers = JSON.parse(raw);
    return String(headers[name] ?? '');
  } catch { return ''; }
};
