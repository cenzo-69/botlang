'use strict';

// $onlyRoles[roleID;errorMessage?]
//
// Stops execution if the message author does NOT have the specified role.
//
// Example:
//   $onlyRoles[123456789012345678;You need the Member role!]
module.exports = async (context, args) => {
  const roleID = String(args[0] || '').trim();
  if (!roleID) return '[error: $onlyRoles requires a roleID]';

  const member = context.message?.member;
  if (!member) return '[error: $onlyRoles requires a guild context]';

  if (!member.roles.cache.has(roleID)) {
    const msg = (args[1] !== undefined && args[1] !== '') ? args[1] : null;
    context._out.stopMessage = msg;
    context.stop();
  }

  return '';
};
