'use strict';

// $userMention[userID?]  — Discord mention string <@userID>
// Defaults to the message author if no userID is provided.
module.exports = async (context, args) => {
  const id = (args[0] && args[0].trim()) ? args[0].trim() : context.message?.author?.id;
  if (!id) return '[error: no user ID]';
  return `<@${id}>`;
};
