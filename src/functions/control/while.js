'use strict';

const evaluateCondition = require('../../core/evaluateCondition');
const { FrameworkError } = require('../../core/errors');

const MAX_ITERATIONS = 1000;

// $while[condition;body]
// Repeats body as long as condition is truthy (max 1000 iterations).
// Both args are LAZY — condition is re-evaluated every iteration.
// Use $break to exit early, $continue to skip to the next iteration.
// Break/continue use the shared variables map with sentinel keys.
module.exports = {
  lazy: [0, 1],

  execute: async (context, args) => {
    const condNodes = args[0];
    const bodyNodes = args[1];

    if (!Array.isArray(condNodes) || !Array.isArray(bodyNodes)) return '';

    let output = '';
    let i = 0;

    while (i < MAX_ITERATIONS) {
      if (context.stopped) break;

      // Re-evaluate condition each iteration
      const cond = await context.executeNodes(condNodes);
      if (!evaluateCondition(cond)) break;

      const iterCtx = context.child();
      iterCtx.loopIndex  = i;
      iterCtx.loopNumber = i + 1;

      output += await iterCtx.executeNodes(bodyNodes);

      // $break — exit immediately
      if (context.variables.get('__BREAK__')) {
        context.variables.delete('__BREAK__');
        break;
      }
      // $continue — skip rest of body, re-check condition
      context.variables.delete('__CONTINUE__');

      i++;
    }

    if (i >= MAX_ITERATIONS) {
      throw new FrameworkError(
        `$while exceeded maximum of ${MAX_ITERATIONS} iterations`,
        'while'
      );
    }

    return output;
  },
};
