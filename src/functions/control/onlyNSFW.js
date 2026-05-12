'use strict';

// $onlyNSFW[errorMessage?]
// Stops execution if the command is not used in an NSFW channel.
module.exports = async (context, args) => {
  const errorMsg = (args[0] !== undefined && String(args[0]).trim() !== '') ? String(args[0]).trim() : null;
  const isNSFW   = context.message?.channel?.nsfw ?? false;
  if (!isNSFW) {
    context._out.stopMessage = errorMsg;
    context.stop();
  }
  return '';
};
