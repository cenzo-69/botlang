'use strict';

/**
 * onMessage — fires every time a user sends a message.
 *
 * Available via $get[varName] in your code:
 *   (standard message context — $authorID, $channelID, $content etc. all work normally)
 *
 * Example:
 *   code: `$if[$content==hello;true]
 *   Hello back, $username!
 *   $endif`
 */
module.exports = {
  name: 'onMessage',

  // Uncomment and edit to activate:
  // code: ``,
};
