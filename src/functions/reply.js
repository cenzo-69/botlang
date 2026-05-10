'use strict';

// $reply[content]
module.exports = async (context, args) => {
  if (!context.message) return '';

  const content = args[0] || '';

  try {
    await context.message.reply(content);
  } catch (err) {
    console.error(`[$reply] ${err.message}`);
  }

  return '';
};
