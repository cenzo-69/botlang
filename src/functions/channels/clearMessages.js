'use strict';
// $clearMessages[channelID;amount;deletePinned?;deleteBots?]  — bulk deletes messages
// Returns the count of messages deleted.
module.exports = async (context, args) => {
  const id           = String(args[0] !== undefined ? args[0] : '').trim();
  const amount       = Math.min(100, Math.max(1, parseInt(args[1]) || 1));
  const deletePinned = args[2] === 'true';
  const deleteBots   = args[3] !== 'false';
  if (!id) return '[error: $clearMessages — channelID is required]';
  try {
    const ch = await context.client?.channels.fetch(id);
    if (!ch) return '[error: $clearMessages — channel not found]';
    let msgs = await ch.messages.fetch({ limit: amount + 10 });
    if (!deletePinned) msgs = msgs.filter(m => !m.pinned);
    if (!deleteBots)   msgs = msgs.filter(m => !m.author?.bot);
    const toDelete = [...msgs.values()].slice(0, amount);
    if (!toDelete.length) return '0';
    await ch.bulkDelete(toDelete, true);
    return String(toDelete.length);
  } catch (err) { return `[error: $clearMessages — ${err.message}]`; }
};
