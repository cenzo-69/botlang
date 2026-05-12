'use strict';

// $jsonClear
// Clears the current JSON context (removes the stored parsed object).
module.exports = async (context, _args) => {
  context.variables.delete('__json_ctx__');
  return '';
};
