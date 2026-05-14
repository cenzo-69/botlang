'use strict';

const { argError } = require('../../core/fnError');

// $onlyChannels[channelID;errorMessage?]
//
// Stops execution if the command was not used in the specified channel.
//
// Example:
//   $onlyChannels[111222333444555666;This command only works in #bot-commands]
module.exports = async (context, args) => {
  const channelID = String(args[0] || '').trim();
  if (!channelID) return argError(context, 'channel ID', 'TextChannel', channelID);

  if (context.message?.channel?.id !== channelID) {
    const msg = (args[1] !== undefined && args[1] !== '') ? args[1] : null;
    context._out.stopMessage = msg;
    context.stop();
  }

  return '';
};
