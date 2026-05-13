'use strict';

/**
 * Example: voiceStateUpdate event
 * Fires when a user joins, leaves, or switches voice channels.
 *
 * args: (oldState, newState)
 * Use execute() for complex logic, or code: for simple CenzoJS scripts.
 */
module.exports = {
  name:  'voiceStateUpdate',
  once:  false,

  execute: async (client, runtime, oldState, newState) => {
    const member = newState.member ?? oldState.member;
    if (!member || member.user.bot) return;

    // Joined a channel
    if (!oldState.channelId && newState.channelId) {
      // console.log(`${member.user.tag} joined ${newState.channel?.name}`);
    }

    // Left a channel
    if (oldState.channelId && !newState.channelId) {
      // console.log(`${member.user.tag} left ${oldState.channel?.name}`);
    }
  },
};
