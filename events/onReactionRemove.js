'use strict';

/**
 * onReactionRemove — fires when a user removes a reaction from a message.
 *
 * Available via $getVar[varName] in your code:
 *   reactionEmoji    → emoji name (e.g. "👍" or "pepega")
 *   reactionEmojiID  → emoji ID (empty for Unicode emoji)
 *   reactionIsCustom → "true" if custom emoji, "false" for Unicode
 *   reactorID        → user ID who removed the reaction
 *   reactorTag       → User#0000
 *   reactorUsername  → plain username
 *   reactedMessageID → the message
 *   reactedChannelID → the channel ID
 *   reactedAuthorID  → the original message author's ID
 *   reactionCount    → remaining count of this reaction
 */
module.exports = {
  name: 'onReactionRemove',

  // Uncomment and edit to activate:
  // code: `<@$getVar[reactorID]> removed their $getVar[reactionEmoji] reaction`,
};
