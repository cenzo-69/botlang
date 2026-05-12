'use strict';

// $argsCheck[requiredCount;errorMessage]
// Stops execution if the number of command arguments is less than requiredCount.
module.exports = async (context, args) => {
  const required = parseInt(args[0]) || 0;
  const errorMsg = (args[1] !== undefined && String(args[1]).trim() !== '') ? String(args[1]).trim() : null;
  const actual   = context.commandArgs?.length ?? 0;
  if (actual < required) {
    context._out.stopMessage = errorMsg;
    context.stop();
  }
  return '';
};
