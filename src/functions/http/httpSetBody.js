'use strict';
// $httpSetBody[body]  — sets the request body for the next HTTP request
module.exports = async (context, args) => {
  const body = String(args[0] !== undefined ? args[0] : '');
  context.variables.set('__http_body__', body);
  return '';
};
