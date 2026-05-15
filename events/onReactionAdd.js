'use strict';

/**
 * onReactionAdd — fires when a user adds a reaction to a message.
 *
 * Available via $get[varName] in your code:
 *   reactionEmoji    → emoji name (e.g. "👍" or "pepega")
 *   reactionEmojiID  → emoji ID (empty for Unicode emoji)
 *   reactionIsCustom → "true" if custom emoji, "false" for Unicode
 *   reactorID        → user ID who added the reaction
 *   reactorTag       → User#0000
 *   reactorUsername  → plain username
 *   reactedMessageID → the message that was reacted to
 *   reactedChannelID → the channel ID
 *   reactedAuthorID  → the original message author's ID
 *   reactionCount    → total count of this reaction on the message
 *
 * Note: Requires MESSAGE_CONTENT and MESSAGE_REACTIONS intents.
 */
module.exports = {
  name: 'onReactionAdd',

  // Uncomment and edit to activate:
  // code: `<@$get[reactorID]> reacted with $get[reactionEmoji] on a message by <@$get[reactedAuthorID]>`,
};
