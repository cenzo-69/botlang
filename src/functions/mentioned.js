module.exports = async (message, args) => {
  const index = (Number(args[0]) || 1) - 1;

  const fallbackAuthor = args[1] === "true";

  const mentions = [...message.mentions.users.values()];

  const member = mentions[index];

  if (!member) {
    if (fallbackAuthor) {
      return message.author.id;
    }

    return "❌❌ Mention not found";
  }

  return member.id;
};