module.exports = async (message, args) => {
  const userId = args[0];

  if (!userId) {
    return "❌❌ userID not found";
  }

  try {
    const user = await message.client.users.fetch(userId);

    return user.displayAvatarURL({
      dynamic: true
    });
  } catch {
    return "❌❌ userID not found";
  }
};