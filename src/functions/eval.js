'use strict';

// $eval[code]
// Re-executes the given string as framework syntax — NOT JavaScript.
//
// The entire execution context is inherited: variables, command args,
// message, client. This means $eval can access $username, $channelID,
// $getVar, etc. just as if the code were written inline.
//
// Primary use case — user-provided code:
//   Command code:  $eval[$message]
//   User types:    !eval Hello $username, you are in $channelName!
//   $message →    "Hello $username, you are in $channelName!"
//   $eval runs that string through the parser/interpreter
//   Output:        "Hello TestUser, you are in #general!"
//
// Nested example:
//   $eval[$getVar[template]]
//   → fetches a stored template string and executes it as framework code
//
// NOTE: $eval NEVER executes JavaScript. Only framework $functions are
//       recognised. Unknown $names pass through as literal text.
module.exports = async (context, args) => {
  const code = String(args[0] !== undefined ? args[0] : '');
  if (!code) return '';

  // Re-run through the full framework pipeline, sharing the current context.
  // Variables written inside $eval are visible to the outer script and vice versa.
  return context.runtime.run(code, {
    message:        context.message,
    client:         context.client,
    variables:      context.variables,    // shared scope — intentional
    commandName:    context.commandName,
    commandInput:   context.commandInput,
    commandArgs:    context.commandArgs,
    noMentionInput: context.noMentionInput,
  });
};
