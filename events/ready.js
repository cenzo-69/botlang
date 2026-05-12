'use strict';

/**
 * Example: ready event
 * Fires once when the bot connects to Discord.
 *
 * To activate: keep this file as-is and restart the bot.
 * To customize: edit the `execute` function below.
 */
module.exports = {
  name:  'ready',
  once:  true,

  execute: async (client, runtime, readyClient) => {
    // Example: log a startup message or set a custom status
    console.log(`[Events:ready] ${readyClient.user.tag} is online in ${readyClient.guilds.cache.size} server(s).`);

    // Uncomment to set a custom status on startup:
    // readyClient.user.setPresence({
    //   activities: [{ name: 'CenzoJS', type: 0 }],
    //   status: 'online',
    // });
  },
};
