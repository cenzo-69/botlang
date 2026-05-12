'use strict';

/**
 * Example: guildMemberAdd event — fires when a new member joins a server.
 *
 * Uncomment and customize the `execute` body (or switch to `code:` style).
 * Remove this file if you don't need a welcome handler.
 */
module.exports = {
  name:  'guildMemberAdd',
  once:  false,

  execute: async (client, runtime, member) => {
    // Example: send a welcome DM to the new member
    // try {
    //   await member.send(`Welcome to **${member.guild.name}**, ${member.user.username}!`);
    // } catch {}

    // Example: send a welcome message to a specific channel
    // const channel = member.guild.channels.cache.find(c => c.name === 'welcome');
    // if (channel) await channel.send(`Welcome, <@${member.id}>! 🎉`);

    console.log(`[Events:guildMemberAdd] ${member.user.tag} joined ${member.guild.name}`);
  },
};
