'use strict';
// $botID  — returns the bot's user ID
module.exports = async (context) => context.client?.user?.id ?? '';
