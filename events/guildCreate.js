'use strict';

/**
 * Example: guildCreate event — fires when the bot joins a new server.
 */
module.exports = {
  name:  'guildCreate',
  once:  false,

  execute: async (client, runtime, guild) => {
    console.log(`[Events:guildCreate] Joined server: ${guild.name} (${guild.id}) — ${guild.memberCount} members`);

    // Example: send a message to the system channel
    // const channel = guild.systemChannel;
    // if (channel) await channel.send('Thanks for adding me! Use /help to get started.').catch(() => {});
  },
};
