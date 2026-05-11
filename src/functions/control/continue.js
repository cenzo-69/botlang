'use strict';

// $continue — skips the rest of the current loop iteration and moves to the next.
// Sets the __CONTINUE__ sentinel on the shared variables map AND stops the
// current context so the rest of the body is not executed.
module.exports = async (context) => {
  context.variables.set('__CONTINUE__', '1');
  context.stop(); // halt current iteration body, then loop advances
  return '';
};
