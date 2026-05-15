'use strict';

// $getBotInvite
// Returns the OAuth2 invite URL for the bot with Administrator permission.
module.exports = async (context, args) => {
  const clientID = context.client?.user?.id;
  if (!clientID) return '[error: No client!]';
  return `https://discord.com/api/oauth2/authorize?client_id=${clientID}&permissions=8&scope=bot%20applications.commands`;
};
