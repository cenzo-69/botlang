'use strict';

// $jsonPretty[(indent)]
// Returns a pretty-printed version of the current JSON context.
// indent — number of spaces (default: 2)
module.exports = async (context, args) => {
  const obj = context.variables.get('__json_ctx__');
  if (obj === undefined) return '[error: No JSON context loaded!]';
  const indentRaw = args[0] !== undefined && args[0] !== '' ? parseInt(args[0]) : 2;
  const indent = isNaN(indentRaw) ? 2 : indentRaw;
  return JSON.stringify(obj, null, indent);
};
