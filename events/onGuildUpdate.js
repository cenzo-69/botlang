'use strict';

/**
 * onGuildUpdate — fires when the server settings change (name, icon, region, etc.)
 *
 * Available via $getVar[varName] in your code:
 *   guildID      → the server's ID
 *   oldGuildName → server name before the change
 *   newGuildName → server name after the change
 *   memberCount  → total member count
 */
module.exports = {
  name: 'onGuildUpdate',

  // Uncomment and edit to activate:
  // code: `
  //   $if[$getVar[oldGuildName]!=$getVar[newGuildName]]
  //   🏠 Server renamed from **$getVar[oldGuildName]** to **$getVar[newGuildName]**!
  //   $endif
  // `,
};
