'use strict';

/**
 * onMessageEdit — fires when a message is edited.
 *
 * Available via $get[varName] in your code:
 *   oldContent       → message content before the edit
 *   newContent       → message content after the edit
 *   editedAuthorID   → the author's user ID
 *   editedChannelID  → the channel ID
 *   editedMessageID  → the message ID
 *
 * Note: oldContent may be empty if the message was not cached.
 */
module.exports = {
  name: 'onMessageEdit',

  // Uncomment and edit to activate:
  // code: `✏️ <@$get[editedAuthorID]> edited a message in <#$get[editedChannelID]>.\nBefore: $get[oldContent]\nAfter: $get[newContent]`,
};
