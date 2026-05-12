'use strict';
// $userCount  — total number of unique users cached by the bot
module.exports = async (context) => String(context.client?.users.cache.size ?? 0);
