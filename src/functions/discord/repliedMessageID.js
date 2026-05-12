'use strict';

// $repliedMessageID
// Returns the ID of the message being replied to, or empty string if not a reply.
module.exports = async (context, args) => {
  return context.message?.reference?.messageId ?? '';
};
