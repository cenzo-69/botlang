'use strict';

// $serverOwnerID  — Discord user ID of the server owner
module.exports = async (context, args) => {
  return context.message?.guild?.ownerId || '[error: no guild]';
};
