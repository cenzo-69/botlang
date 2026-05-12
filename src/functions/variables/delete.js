'use strict';
// $delete[key]  — deletes a session variable, returns "true" if it existed
module.exports = async (context, args) => {
  const key = String(args[0] !== undefined ? args[0] : '').trim();
  if (!key) return '[error: $delete — key is required]';
  return String(context.variables.delete(key));
};
