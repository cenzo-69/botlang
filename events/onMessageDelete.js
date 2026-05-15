'use strict';

/**
 * onMessageDelete — fires when a message is deleted.
 *
 * Available via $get[varName] in your code:
 *   deletedContent   → the deleted message content (empty if message was not cached)
 *   deletedAuthorID  → the author's user ID
 *   deletedChannelID → the channel the message was in
 *   deletedMessageID → the message ID
 *
 * Note: If the message was not cached by Discord, deletedContent will be empty.
 */
module.exports = {
  name: 'onMessageDelete',

  // Uncomment and edit to activate:
  // code: `🗑️ A message by <@$get[deletedAuthorID]> was deleted in <#$get[deletedChannelID]>.\nContent: $get[deletedContent]`,
};
