'use strict';

/**
 * Example: messageDelete event — fires when a message is deleted.
 * Useful for snipe/logging features.
 *
 * Remove or leave commented out if not needed.
 */
module.exports = {
  name:  'messageDelete',
  once:  false,

  execute: async (client, runtime, message) => {
    // Ignore bot messages and partial messages
    if (!message.author || message.author.bot) return;

    // Example: log deleted messages to a channel
    // const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
    // if (logChannel) {
    //   await logChannel.send(
    //     `🗑️ **Message deleted** by **${message.author.tag}** in <#${message.channelId}>:\n> ${message.content || '(no content)'}`
    //   );
    // }
  },
};
