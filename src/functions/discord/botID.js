'use strict';

// $botID  — the bot's own user ID
module.exports = async (context, args) => {
  return context.client?.user?.id || '[error: bot not ready]';
};
