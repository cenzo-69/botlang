'use strict';

// $isNSFW[channelID?]
// Returns "true" if the channel (or specified channelID) is marked as NSFW.
module.exports = async (context, args) => {
  const channelID = String(args[0] || '').trim();
  if (channelID) {
    try {
      const ch = await context.client?.channels.fetch(channelID);
      return String(ch?.nsfw ?? false);
    } catch {
      return 'false';
    }
  }
  return String(context.message?.channel?.nsfw ?? false);
};
