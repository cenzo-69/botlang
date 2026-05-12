'use strict';

// $mentionedRoles[index]
// Returns the Nth mentioned role as a mention string.
module.exports = async (context, args) => {
  const index = Math.max(1, parseInt(args[0]) || 1);
  const roles = [...(context.message?.mentions?.roles?.values() ?? [])];
  const role  = roles[index - 1];
  if (!role) return '';
  return `<@&${role.id}>`;
};
