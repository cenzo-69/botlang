/**
 * Select menu handler for "testselect".
 * Fires when a user picks an option from the dropdown in testinteraction.
 */
module.exports = {
  name:      'testselect',
  type:      'selectmenu',
  customID:  'testselect',
  ephemeral: true,

  code: [
    '$title[📋 Select Menu Works!]',
    '$color[EB459E]',
    '$description[You picked an option from the select menu!]',
    '$field[Selected value;$commandArgs[0];true]',
    '$field[Selected by;<@$authorID>;true]',
    '$footer[Select menu interactions are working correctly ✓]',
  ].join('\n'),
};
