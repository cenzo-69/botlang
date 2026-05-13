'use strict';

const fnError = require('../../core/fnError');

// $removeRole[userID;roleID;reason?]
// Removes a role from a guild member. Returns '' (action function — no output leak).
module.exports = async (context, args) => {
  const guild = context.message?.guild ?? context.interaction?.guild;
  if (!guild) {
    return fnError('removeRole', 'guild context is required', {
      tip: '$removeRole only works inside a server command',
    });
  }

  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  const roleID = String(args[1] !== undefined ? args[1] : '').trim();

  if (!userID) {
    return fnError('removeRole', 'userID is required', {
      expected: 'a valid Discord user ID',
      example:  '$removeRole[$authorID;123456789]',
    });
  }
  if (!roleID) {
    return fnError('removeRole', 'roleID is required', {
      expected: 'a valid Discord role ID',
      example:  '$removeRole[$authorID;987654321]',
    });
  }

  const reason = args[2] !== undefined ? String(args[2]) : undefined;

  try {
    const member = await guild.members.fetch(userID);
    await member.roles.remove(roleID, reason);
    return '';
  } catch (err) {
    return fnError('removeRole', err.message, {
      got: `userID=${userID}, roleID=${roleID}`,
      tip: 'Check the bot has "Manage Roles" permission and the role is below the bot\'s highest role',
    });
  }
};
