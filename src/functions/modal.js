'use strict';

// $modal[customID;title]
//
// Modals can only be shown in response to a slash command or button interaction —
// they cannot be sent via a regular message. This function is a no-op stub
// that returns an informational message. Use $modal in an interaction handler.
module.exports = async (context, args) => {
  return '[modal: modals require an interaction context — use $modal in a slash command or button handler]';
};
