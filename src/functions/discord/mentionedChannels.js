'use strict';

// $mentionedChannels[index;(returnMention)]
// Returns the Nth mentioned channel. returnMention=false returns the ID only.
module.exports = async (context, args) => {
  const index         = Math.max(1, parseInt(args[0]) || 1);
  const returnMention = String(args[1] || 'true').trim().toLowerCase() !== 'false';
  const channels      = [...(context.message?.mentions?.channels?.values() ?? [])];
  const ch            = channels[index - 1];
  if (!ch) return '';
  return returnMention ? `<#${ch.id}>` : ch.id;
};
