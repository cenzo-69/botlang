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

  // Note: deletedContent is empty for messages not cached by Discord (older messages).
  code: [
    '$title[🗑️ Message Deleted]',
    '$color[ED4245]',
    '$description[A message by <@$get[deletedAuthorID]> was deleted.]',
    '$addField[Author ID;`$get[deletedAuthorID]`;true]',
    '$addField[Channel;<#$get[deletedChannelID]>;true]',
    '$addField[Content;$if[$get[deletedContent]==;*(not cached)*;$get[deletedContent]);false]',
    '$footer[onMessageDelete ✓ — CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
