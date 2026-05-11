'use strict';

// $serverID  — alias for $guildID
module.exports = async (context, args) => {
  return context.message?.guild?.id || '[error: no guild]';
};
