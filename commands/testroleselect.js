'use strict';

/**
 * Select menu handler for the role select in /testinteraction.
 * customID: testroleselect
 * $commandArgs[0] contains the selected role's ID.
 */
module.exports = {
  name:      'testroleselect',
  type:      'selectmenu',
  customID:  'testroleselect',
  ephemeral: true,

  code: [
    '$title[🎭 Role Picked!]',
    '$color[EB459E]',
    '$description[You selected a role using the **Role Select** menu:]',

    '$addField[Selected Role;<@&$commandArgs[0]>;true]',
    '$addField[Role ID;`$commandArgs[0]`;true]',
    '$addField[Picked by;<@$authorID>;true]',

    '$footer[Role select menu ✓ — CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
