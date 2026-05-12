'use strict';
// $clearUserMessages[channelID;userID;amount;deletePinned?]  — deletes messages from a specific user
module.exports = async (context, args) => {
  const id           = String(args[0] !== undefined ? args[0] : '').trim();
  const userID       = String(args[1] !== undefined ? args[1] : '').trim();
  const amount       = Math.min(100, Math.max(1, parseInt(args[2]) || 1));
  const deletePinned = args[3] === 'true';
  if (!id || !userID) return '[error: $clearUserMessages — channelID and userID are required]';
  try {
    const ch = await context.client?.channels.fetch(id);
    if (!ch) return '[error: $clearUserMessages — channel not found]';
    let msgs = await ch.messages.fetch({ limit: 100 });
    msgs = msgs.filter(m => m.author?.id === userID);
    if (!deletePinned) msgs = msgs.filter(m => !m.pinned);
    const toDelete = [...msgs.values()].slice(0, amount);
    if (!toDelete.length) return '0';
    await ch.bulkDelete(toDelete, true);
    return String(toDelete.length);
  } catch (err) { return `[error: $clearUserMessages — ${err.message}]`; }
};
