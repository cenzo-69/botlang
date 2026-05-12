'use strict';

// $ephemeral
// Marks the response as ephemeral (only visible to the command user).
// Only works for slash command interactions.
// Sets the __ephemeral__ flag — your interaction handler should pass { ephemeral: true }.
module.exports = async (context, _args) => {
  context.variables.set('__ephemeral__', true);
  return '';
};
