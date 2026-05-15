'use strict';

/**
 * Select menu handler for the /help command category picker.
 * When a user picks a category, $commandArgs[0] contains the category ID.
 * $find[categoryID] returns all functions in that category.
 */
module.exports = {
  name:      'helpselect',
  type:      'selectmenu',
  customID:  'helpselect',
  ephemeral: true,

  code: '$find[$commandArgs[0]]',
};
