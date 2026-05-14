'use strict';

const { argError } = require('../../core/fnError');

// $editChannelPerms[channelID;userID/roleID;permission;...]
// Sets permission overrides on a channel for a user or role.
// Prefix with "+" to allow, "-" to deny (e.g. "+SendMessages;-ViewChannel").
module.exports = async (context, args) => {
  const channelID = String(args[0] || '').trim();
  const targetID  = String(args[1] || '').trim();
  const perms     = args.slice(2).filter(Boolean);
  if (!channelID || !targetID) return argError(context, 'channel ID', 'TextChannel', channelID);
  try {
    const channel  = await context.client.channels.fetch(channelID);
    const overrides = {};
    for (const p of perms) {
      if (p.startsWith('-')) {
        overrides[p.slice(1)] = false;
      } else {
        overrides[p.startsWith('+') ? p.slice(1) : p] = true;
      }
    }
    await channel.permissionOverwrites.edit(targetID, overrides);
    return '';
  } catch (err) {
    return `[error: $editChannelPerms — ${err.message}]`;
  }
};
