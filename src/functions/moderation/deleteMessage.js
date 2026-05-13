'use strict';

const fnError   = require('../../core/fnError');
const parseTime = require('../../core/parseTime');

// $deleteMessage            — deletes the trigger message immediately
// $deleteMessage[delay]     — deletes after delay (e.g. 3s, 500ms)
// $deleteMessage[delay;id]  — deletes a specific message ID after delay
// Returns '' (action function — no output leak).
module.exports = async (context, args) => {
  const delayRaw  = args[0] !== undefined ? String(args[0]).trim() : '0';
  const messageID = args[1] !== undefined ? String(args[1]).trim() : '';

  // Support both raw-ms integers and s/ms/m format
  const delayMs = parseTime(delayRaw) || (parseInt(delayRaw) || 0);

  const doDelete = async () => {
    try {
      if (messageID) {
        // Delete a specific message ID
        const channel = context.message?.channel ?? context.interaction?.channel;
        if (!channel) return;
        const msg = await channel.messages.fetch(messageID).catch(() => null);
        if (msg?.deletable) await msg.delete();
      } else {
        // Delete the trigger message
        const msg = context.message;
        if (msg?.deletable) await msg.delete();
      }
    } catch (err) {
      console.error(`[$deleteMessage] ${err.message}`);
    }
  };

  if (delayMs > 0) {
    setTimeout(doDelete, Math.min(delayMs, 300_000)); // cap at 5 min
  } else {
    await doDelete();
  }

  return '';
};
