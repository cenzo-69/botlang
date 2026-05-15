'use strict';

// $httpStatus
// Returns the HTTP status code from the last HTTP request (e.g. "200", "404").
module.exports = async (context, _args) => {
  return context.variables.get('__http_status__') ?? '[error: No HTTP request made yet!]';
};
