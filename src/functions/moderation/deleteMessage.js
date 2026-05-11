'use strict';

// $deleteMessage          → deletes the trigger message
// $deleteMessage[delay]   → deletes after N milliseconds
module.exports = async (context, args) => {
  if (!context.message) return '';

  const delay = parseInt(args[0]) || 0;

  const doDelete = async () => {
    try {
      if (context.message.deletable) await context.message.delete();
    } catch (err) {
      console.error(`[$deleteMessage] ${err.message}`);
    }
  };

  if (delay > 0) {
    setTimeout(doDelete, Math.min(delay, 60_000));
  } else {
    await doDelete();
  }

  return '';
};
