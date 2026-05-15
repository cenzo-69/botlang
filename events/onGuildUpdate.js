'use strict';

/**
 * onGuildUpdate — fires when the server settings change (name, icon, region, etc.)
 *
 * Available via $get[varName] in your code:
 *   guildID      → the server's ID
 *   oldGuildName → server name before the change
 *   newGuildName → server name after the change
 *   memberCount  → total member count
 */
module.exports = {
  name: 'onGuildUpdate',

  // Uncomment and edit to activate:
  // code: `$if[$get[oldGuildName]!=$get[newGuildName];true]
  // 🏠 Server renamed from **$get[oldGuildName]** to **$get[newGuildName]**!
  // $endif`,
};
