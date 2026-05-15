'use strict';

// $onlyBotPerms[permission;...;errorMessage]
// Stops execution if the bot is missing any of the listed permissions.
// Last argument is always the error message.
module.exports = async (context, args) => {
  if (args.length < 2) return '[error: $onlyBotPerms requires at least one permission and an error message!]';
  const errorMsg  = (String(args[args.length - 1]).trim() !== '') ? String(args[args.length - 1]).trim() : null;
  const perms     = args.slice(0, -1).filter(Boolean);
  const botMember = context.message?.guild?.members?.me;
  if (!botMember) return '[error: No guild!]';
  const missing = perms.filter(p => !botMember.permissions.has(p));
  if (missing.length) {
    context._out.stopMessage = errorMsg;
    context.stop();
  }
  return '';
};
