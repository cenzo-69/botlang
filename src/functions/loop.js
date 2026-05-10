'use strict';

const { FrameworkError } = require('../core/errors');

const MAX_ITERATIONS = 1000;

// $loop[count;code]
// Repeats 'code' N times. Inside the loop body, $loopIndex gives the
// current iteration (0-based) and $loopNumber gives the 1-based count.
//
// 'code' is LAZY — it is not pre-resolved before the function runs.
// Instead it receives the raw AST nodes and re-executes them each iteration.
module.exports = {
  lazy: [1],

  execute: async (context, args) => {
    const count = parseInt(args[0]);
    const bodyNodes = args[1]; // raw node array (lazy)

    if (isNaN(count) || count < 1) return '';
    if (count > MAX_ITERATIONS) {
      throw new FrameworkError(
        `$loop count exceeds maximum of ${MAX_ITERATIONS}`,
        'loop'
      );
    }

    if (!Array.isArray(bodyNodes)) return '';

    let output = '';
    for (let i = 0; i < count; i++) {
      if (context.stopped) break;

      // Give each iteration its own child context with loop metadata
      const iterCtx = context.child();
      iterCtx.loopIndex = i;
      iterCtx.loopNumber = i + 1;
      iterCtx.loopCount = count;

      output += await iterCtx.executeNodes(bodyNodes);
    }

    return output;
  },
};
