'use strict';

const evaluateCondition = require('../../core/evaluateCondition');
const fnError           = require('../../core/fnError');

// $onlyIf[condition;errorMessage?]
//
// Continues execution ONLY if condition evaluates to true.
// If false: halts execution. If errorMessage is given, it becomes the sole output.
//
// Supports all comparison operators: == != > < >= <=
// And logical operators:             && ||
//
// Examples:
//   $onlyIf[$argsCount>=1;Please provide an argument!]
//   $onlyIf[$authorID==$ownerID;🔒 Owner only!]
//   $onlyIf[$memberCount>=10&&$isAdmin==true;Need 10+ members and admin]
//   $onlyIf[$message==hi||$message==hello;Say hi or hello!]
module.exports = async (context, args) => {
  const condition = String(args[0] !== undefined ? args[0] : '');

  if (!evaluateCondition(condition)) {
    const msg = (args[1] !== undefined && String(args[1]).trim() !== '')
      ? String(args[1])
      : null;
    context._out.stopMessage = msg;
    context.stop();
  }

  return '';
};
