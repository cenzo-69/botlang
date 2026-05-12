'use strict';
// $httpSetContentType[contentType]  — sets Content-Type for the next HTTP request
module.exports = async (context, args) => {
  const ct = String(args[0] !== undefined ? args[0] : 'application/json').trim();
  context.variables.set('__http_content_type__', ct);
  return '';
};
