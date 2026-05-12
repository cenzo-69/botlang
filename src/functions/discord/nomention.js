'use strict';

// $nomention
// Disables all @mentions in the bot's reply (sets allowedMentions to none).
// Sets the __nomention__ flag — your reply handler should pass allowedMentions: { parse: [] }.
module.exports = async (context, _args) => {
  context.variables.set('__nomention__', true);
  return '';
};
