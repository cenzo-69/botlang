'use strict';

// $onlyAdmin[errorMessage?]
// Stops execution if the command author does not have the Administrator permission.
module.exports = async (context, args) => {
  const errorMsg = (args[0] !== undefined && String(args[0]).trim() !== '') ? String(args[0]).trim() : null;
  const isAdmin  = context.message?.member?.permissions?.has('Administrator') ?? false;
  if (!isAdmin) {
    context._out.stopMessage = errorMsg;
    context.stop();
  }
  return '';
};
