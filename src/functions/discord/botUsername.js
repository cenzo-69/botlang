'use strict';

// $botUsername  — the bot's display name
module.exports = async (context, args) => {
  return context.client?.user?.username || '[error: bot not ready]';
};
