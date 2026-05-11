'use strict';

// $serverName  — alias for $guildName
module.exports = async (context, args) => {
  return context.message?.guild?.name || '[error: no guild]';
};
