'use strict';

// $aiQuota
// Returns the total number of tokens used by AI functions in this script run.
module.exports = async (context, _args) => {
  return String(context.variables.get('__ai_tokens__') || 0);
};
