'use strict';

// $executionTime
// Returns the script execution time in milliseconds from when the context was created.
module.exports = async (context, _args) => {
  const start = context.variables.get('__start_time__') ?? Date.now();
  return String(Date.now() - start);
};
