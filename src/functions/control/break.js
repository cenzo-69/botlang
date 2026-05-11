'use strict';

// $break — exits the innermost $while or $forEach loop immediately.
// Sets the __BREAK__ sentinel on the shared variables map AND stops the
// current context so execution of the loop body halts right away.
module.exports = async (context) => {
  context.variables.set('__BREAK__', '1');
  context.stop(); // halt current iteration body immediately
  return '';
};
