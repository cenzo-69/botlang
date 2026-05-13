'use strict';

const fnError    = require('../../core/fnError');
const parseTime  = require('../../core/parseTime');

// $ban[userID;reason?;deleteMessageDays?]
// Bans a user from the guild. Returns '' (action function — no output leak).
module.exports = async (context, args) => {
  const guild = context.message?.guild ?? context.interaction?.guild;
  if (!guild) {
    return fnError('ban', 'guild context is required', {
      tip: '$ban only works inside a server command, not in DMs',
    });
  }

  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!userID) {
    return fnError('ban', 'userID is required', {
      expected: 'a valid Discord user ID',
      example:  '$ban[$mentioned]  or  $ban[123456789;Rule violation]',
    });
  }

  const reason    = args[1] !== undefined ? String(args[1]) : 'No reason provided';
  const deleteMsg = Math.max(0, Math.min(7, parseInt(args[2] ?? 0) || 0));

  try {
    await guild.members.ban(userID, { reason, deleteMessageDays: deleteMsg });
    return '';
  } catch (err) {
    return fnError('ban', err.message, {
      got: userID,
      tip: 'Check the bot has "Ban Members" permission and outranks the target',
    });
  }
};
