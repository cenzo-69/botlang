'use strict';

// $onlyAdmin[errorMessage?]
// Stops execution if the author does not have the Administrator permission.
// Works in both message commands and slash interactions.
module.exports = async (context, args) => {
  const errorMsg = (args[0] !== undefined && String(args[0]).trim() !== '')
    ? String(args[0])
    : null;

  const member = context.message?.member ?? context.interaction?.member;
  const isAdmin = member?.permissions?.has('Administrator') ?? false;

  if (!isAdmin) {
    context._out.stopMessage = errorMsg;
    context.stop();
  }

  return '';
};
