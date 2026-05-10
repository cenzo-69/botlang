'use strict';

// $avatar               → author's avatar URL
// $avatar[userID]       → avatar of specific user
module.exports = async (context, args) => {
  const userId = args[0] || context.message?.author?.id;
  if (!userId) return '[unknown user]';

  try {
    const user = await context.client.users.fetch(userId);
    return user.displayAvatarURL({ dynamic: true, size: 1024 });
  } catch {
    return '[user not found]';
  }
};
