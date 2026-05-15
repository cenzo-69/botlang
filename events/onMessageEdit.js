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

  // Note: oldContent may be empty if the message was not previously cached by Discord.
  code: [
    '$title[✏️ Message Edited]',
    '$color[FEE75C]',
    '$description[<@$get[editedAuthorID]> edited a message in <#$get[editedChannelID]>.]',
    '$addField[Before;$if[$get[oldContent]==;*(not cached)*;$get[oldContent]);false]',
    '$addField[After;$get[newContent];false]',
    '$footer[onMessageEdit ✓ — CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
