'use strict';

const db = require('../../core/db');

// $isTicket[(channelID)]
// Returns "true" if the channel is an active ticket channel, otherwise "false".
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim()
    || context.message?.channel?.id || '';
  if (!channelID) return 'false';
  return db.has(`__ticket_${channelID}`) ? 'true' : 'false';
};
