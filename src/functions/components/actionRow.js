'use strict';

// $actionRow
// Closes the current action row and starts a new one. Discord allows up to
// 5 action rows per message. Use this to force buttons/selects onto a new row.
// Inserts a sentinel object that the runtime's component builder recognises.
module.exports = async (context) => {
  context.components.push({ type: 'row_break' });
  return '';
};
