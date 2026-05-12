'use strict';
// $channelVoiceMemberIDs[channelID?;separator?]  — returns IDs of members in voice channel
module.exports = async (context, args) => {
  const id  = String(args[0] !== undefined ? args[0] : '').trim();
  const sep = String(args[1] !== undefined ? args[1] : ', ');
  try {
    const ch = id ? await context.client?.channels.fetch(id) : context.message?.channel;
    if (!ch) return '[error: $channelVoiceMemberIDs — channel not found]';
    return [...(ch.members?.keys() ?? [])].join(sep);
  } catch (err) { return `[error: $channelVoiceMemberIDs — ${err.message}]`; }
};
