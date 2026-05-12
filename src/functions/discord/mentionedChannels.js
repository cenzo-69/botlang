'use strict';

// $mentionedChannels[index?;returnMention?]
// Returns mentioned channel IDs. index is 1-based. returnMention=false returns ID only.
// Without args, returns comma-separated list of all mentioned channel IDs.
module.exports = async (context, args) => {
  const channels = [...(context.message?.mentions?.channels?.values() ?? [])];
  if (!channels.length) return '';

  // No args → return all IDs
  if (args[0] === undefined || String(args[0]).trim() === '') {
    return channels.map(c => c.id).join(', ');
  }

  const index         = Math.max(1, parseInt(args[0]) || 1);
  const returnMention = String(args[1] !== undefined ? args[1] : 'true').trim().toLowerCase() !== 'false';
  const ch            = channels[index - 1];
  if (!ch) return '';
  return returnMention ? `<#${ch.id}>` : ch.id;
};
