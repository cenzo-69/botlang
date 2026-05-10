'use strict';

// $authorID  → Discord user ID of the message author
//
// Semantic alias for $userID. Preferred in permission-check contexts
// where the intent ("is this the author?") should be obvious:
//
//   $onlyIf[$authorID==123456789]
//   Welcome to the admin panel, $username!
module.exports = async (context) => {
  return context.message?.author?.id || '';
};
