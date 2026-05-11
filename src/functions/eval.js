'use strict';

// $eval[code]
// Re-executes the given string as framework syntax — NOT JavaScript.
//
// The entire execution context is inherited: variables, embed state,
// command args, message, client. This means $eval can access $username,
// $channelID, $getVar, $title, $color etc. just as if the code were inline.
//
// Primary use case — user-provided code:
//   Command code:  $eval[$message]
//   User types:    !eval $title[Hi]$description[Hello $username!]
//   Result:        embed is built correctly — title and description propagate
//                  back to the outer context and are sent by runForCommandFull
//
// NOTE: $eval NEVER executes JavaScript. Only framework $functions are
//       recognised. Unknown $names pass through as literal text.
module.exports = async (context, args) => {
  const code = String(args[0] !== undefined ? args[0] : '');
  if (!code) return '';

  // Parse then execute inside a child of the CURRENT context.
  //
  // Why not runtime.run()?
  //   runtime.run() constructs a brand-new Context with a fresh embed object,
  //   so $title / $color / $addField called inside $eval would write to a
  //   discarded context — the outer embed would never be updated.
  //
  // By executing inside context.child() instead, the child inherits the same
  // embed reference (and variables Map) as the outer tree, so all mutations
  // are immediately visible to the caller.
  const ast = context.runtime.parse(code);
  return context.runtime.executeAST(ast, context.child());
};
