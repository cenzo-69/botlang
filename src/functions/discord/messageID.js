'use strict';

// $messageID
// Returns the ID of the triggering message.
module.exports = async (context, args) => {
  return context.message?.id ?? '[error: no message]';
};
