'use strict';

// $serverCreated  — ISO 8601 creation date of the server
// Derived from the guild's Discord snowflake ID.
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  return context.message.guild.createdAt.toISOString();
};
