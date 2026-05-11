'use strict';

// $varExists[name]  — returns "true" if the session variable exists, else "false"
module.exports = async (context, args) => {
  const name = args[0];
  if (!name) return 'false';
  const value = context.getVariable(name);
  return (value !== undefined && value !== null) ? 'true' : 'false';
};
