'use strict';

const { argError } = require('../../core/fnError');

// $onlyUsers[userID;errorMessage?]
//
// Stops execution if the message was not sent by the specified user.
//
// Example:
//   $onlyUsers[123456789012345678;Only the bot owner can use this!]
module.exports = async (context, args) => {
  const userID = String(args[0] || '').trim();
  if (!userID) return argError(context, 'user ID', 'Snowflake', userID);

  if (context.message?.author?.id !== userID) {
    const msg = (args[1] !== undefined && args[1] !== '') ? args[1] : null;
    context._out.stopMessage = msg;
    context.stop();
  }

  return '';
};
