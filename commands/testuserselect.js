'use strict';

module.exports = {
  name:      'testuserselect',
  type:      'selectmenu',
  customID:  'testuserselect',
  ephemeral: true,

  code: `
$title[👤 User Picked!]
$color[5865F2]
$description[You selected a member using the **User Select** menu:]
$addField[Selected User; <@$commandArgs[0]>;    true]
$addField[User ID;       \`$commandArgs[0]\`; true]
$addField[Picked by;     <@$authorID>;           true]
$footer[User select menu ✓ — CenzoJS]
$timestamp
  `,
};
