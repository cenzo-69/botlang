'use strict';

// $httpResult[(key;...)]
// Returns the stored HTTP response from the last $httpGet/Post/Put/Patch/Delete call.
// With no args, returns the raw response body.
// With key args, parses as JSON and navigates the key path.
module.exports = async (context, args) => {
  const raw = context.variables.get('__http_response__');
  if (raw === undefined) return '[error: No HTTP response stored; make a request first!]';

  const keys = args.filter(k => k !== '');
  if (!keys.length) return raw;

  let obj;
  try { obj = JSON.parse(raw); }
  catch { return '[error: Response is not valid JSON!]'; }

  let cur = obj;
  for (const key of keys) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return '';
    cur = cur[key];
  }
  if (cur === undefined || cur === null) return '';
  return typeof cur === 'object' ? JSON.stringify(cur) : String(cur);
};
