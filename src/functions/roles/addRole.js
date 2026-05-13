'use strict';

const fnError = require('../../core/fnError');

// $addRole[userID;roleID;reason?]
// Adds a role to a guild member. Returns '' (action function — no output leak).
module.exports = async (context, args) => {
  const guild = context.message?.guild ?? context.interaction?.guild;
  if (!guild) {
    return fnError('addRole', 'guild context is required', {
      tip: '$addRole only works inside a server command',
    });
  }

  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  const roleID = String(args[1] !== undefined ? args[1] : '').trim();

  if (!userID) {
    return fnError('addRole', 'userID is required', {
      expected: 'a valid Discord user ID',
      example:  '$addRole[$authorID;123456789]',
    });
  }
  if (!roleID) {
    return fnError('addRole', 'roleID is required', {
      expected: 'a valid Discord role ID',
      example:  '$addRole[$authorID;987654321]',
    });
  }

  const reason = args[2] !== undefined ? String(args[2]) : undefined;

  try {
    const member = await guild.members.fetch(userID);
    await member.roles.add(roleID, reason);
    return '';
  } catch (err) {
    return fnError('addRole', err.message, {
      got: `userID=${userID}, roleID=${roleID}`,
      tip: 'Check the bot has "Manage Roles" permission and the role is below the bot\'s highest role',
    });
  }
};
