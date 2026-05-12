'use strict';

const fnError = require('../../core/fnError');

// $dm[userID;message]  — sends a direct message to a user
module.exports = async (context, args) => {
  const userID  = String(args[0] !== undefined ? args[0] : '').trim();
  const message = String(args[1] !== undefined ? args[1] : '');

  if (!userID) {
    return fnError('dm', 'userID is required', {
      expected: 'a valid Discord user ID',
      example:  '$dm[123456789;Hello!]',
    });
  }
  if (!message) {
    return fnError('dm', 'message content is required', {
      expected: 'a non-empty string',
      example:  '$dm[123456789;Hello from the bot!]',
    });
  }

  try {
    const user = await context.client?.users.fetch(userID);
    if (!user) return fnError('dm', 'user not found', { got: userID, tip: 'Make sure the user ID is correct and the bot can reach them' });
    await user.send(message);
    return '';
  } catch (err) {
    return fnError('dm', err.message, {
      tip:     'The user may have DMs disabled, or the bot is not in a shared server with them',
      example: '$dm[123456789;Hello!]',
    });
  }
};
