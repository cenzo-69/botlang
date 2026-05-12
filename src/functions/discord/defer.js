'use strict';

// $defer
// Defers the interaction response (shows "Bot is thinking..." for slash commands).
// Sets the __defer__ flag — your interaction handler should call interaction.deferReply().
module.exports = async (context, _args) => {
  context.variables.set('__defer__', true);
  return '';
};
