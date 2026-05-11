'use strict';

const evaluateCondition = require('../core/evaluateCondition');

// $onlyIf[condition]
// $onlyIf[condition;errorMessage]
//
// BDFD-style guard: continues execution ONLY if condition is true.
//
// If condition is FALSE:
//   - Execution halts immediately (same as $stop)
//   - If errorMessage is provided, ONLY that message is sent — any text
//     accumulated before $onlyIf is discarded (stored in context._out)
//   - If no errorMessage, nothing is sent
//
// If condition is TRUE:
//   - Returns '' and execution continues normally
//
// Examples:
//   $onlyIf[$argsCount>=1;Please provide an argument!]
//   You said: $message
//
//   $onlyIf[$authorID==123456789;🔒 Admin only!]
//   Secret admin output here.
module.exports = async (context, args) => {
  const condition = String(args[0] !== undefined ? args[0] : '');

  if (!evaluateCondition(condition)) {
    const msg = (args[1] !== undefined && args[1] !== '') ? args[1] : null;
    // Store the stop message so runForCommandFull can use it as the sole output
    context._out.stopMessage = msg;
    context.stop();
  }

  return '';
};
