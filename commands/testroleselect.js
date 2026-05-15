'use strict';

module.exports = {
  name:      'testroleselect',
  type:      'selectmenu',
  customID:  'testroleselect',
  ephemeral: true,

  code: `
$title[🎭 Role Picked!]
$color[EB459E]
$description[You selected a role using the **Role Select** menu:]
$addField[Selected Role; <@&$commandArgs[0]>;   true]
$addField[Role ID;       \`$commandArgs[0]\`; true]
$addField[Picked by;     <@$authorID>;           true]
$footer[Role select menu ✓ — CenzoJS]
$timestamp
  `,
};
