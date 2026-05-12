'use strict';

// $onlyForIDs[userID;...;errorMessage]
// Stops execution if the command author's ID is not in the provided list.
// Last argument is always the error message.
module.exports = async (context, args) => {
  if (args.length < 2) return '[error: $onlyForIDs requires at least one ID and an error message]';
  const errorMsg = (String(args[args.length - 1]).trim() !== '') ? String(args[args.length - 1]).trim() : null;
  const ids      = args.slice(0, -1).filter(Boolean);
  const authorID = context.message?.author?.id ?? '';
  if (!ids.includes(authorID)) {
    context._out.stopMessage = errorMsg;
    context.stop();
  }
  return '';
};
