'use strict';

const fnError = require('../../core/fnError');

// $kick[userID;reason?]
// Kicks a member from the guild. Returns '' (action function — no output leak).
module.exports = async (context, args) => {
  const guild = context.message?.guild ?? context.interaction?.guild;
  if (!guild) {
    return fnError('kick', 'guild context is required', {
      tip: '$kick only works inside a server command, not in DMs',
    });
  }

  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!userID) {
    return fnError('kick', 'userID is required', {
      expected: 'a valid Discord user ID',
      example:  '$kick[$mentioned]  or  $kick[123456789;Spamming]',
    });
  }

  const reason = args[1] !== undefined ? String(args[1]) : 'No reason provided';

  try {
    const member = await guild.members.fetch(userID);
    await member.kick(reason);
    return '';
  } catch (err) {
    return fnError('kick', err.message, {
      got: userID,
      tip: 'Check the bot has "Kick Members" permission and outranks the target',
    });
  }
};
