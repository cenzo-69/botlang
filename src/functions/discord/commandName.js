'use strict';

// $commandName  → the name of the triggered command (without prefix)
//
// Examples:
//   User types "!ping"       → $commandName → "ping"
//   User types "!say hello"  → $commandName → "say"
//
// Useful for generic error messages, audit logs, or shared handler code:
//   ❌ Unknown error in command: $commandName
module.exports = async (context) => {
  return context.commandName || '';
};
