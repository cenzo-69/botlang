'use strict';

const evaluateCondition = require('../core/evaluateCondition');

// $onlyIf[condition]
//
// Continues execution ONLY if the condition is true.
// If false → immediately halts the script (same as $stop), with no output.
//
// Condition formats — same as $if:
//   value==value   value!=value   value>value   value>=value   etc.
//   value          (truthy check)
//
// Examples:
//   $onlyIf[$argsCount>=1]
//   You said: $message
//
//   $onlyIf[$authorID==123456789]
//   🔐 Admin command executed.
//
//   $onlyIf[$guildID==987654321]
//   This command only works in the home server.
module.exports = async (context, args) => {
  const condition = String(args[0] !== undefined ? args[0] : '');
  if (!evaluateCondition(condition)) {
    context.stop();
  }
  return '';
};
