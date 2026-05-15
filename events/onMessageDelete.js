'use strict';

/**
 * onMessageDelete — fires when a message is deleted.
 *
 * Available via $getVar[varName] in your code:
 *   deletedContent   → the deleted message content (empty if message was not cached)
 *   deletedAuthorID  → the author's user ID
 *   deletedChannelID → the channel the message was in
 *   deletedMessageID → the message ID
 */
module.exports = {
  name: 'onMessageDelete',

  code: `
    $title[🗑️ Message Deleted]
    $color[ED4245]
    $description[A message by <@$getVar[deletedAuthorID]> was deleted.]
    $addField[Author ID;\`$getVar[deletedAuthorID]\`;true]
    $addField[Channel;<#$getVar[deletedChannelID]>;true]
    $addField[Content;$if[$getVar[deletedContent]==;*(not cached)*;$getVar[deletedContent]];false]
    $footer[onMessageDelete ✓ — CenzoJS]
    $timestamp
  `,
};
