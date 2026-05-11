'use strict';

// $forEach[items;separator;body]
// Splits `items` by `separator` and executes `body` once per element.
// Inside the body:
//   $forEachValue  — the current element
//   $forEachIndex  — the 0-based iteration index
//   $forEachNumber — the 1-based iteration number
//   $break         — halt body AND exit loop (sets __BREAK__ + stops context)
//   $continue      — halt body AND advance to next element (sets __CONTINUE__ + stops context)
//
// Each iteration runs in its own child context so stopping it never
// propagates to the caller's context.
module.exports = {
  lazy: [2],

  execute: async (context, args) => {
    const list      = String(args[0] !== undefined ? args[0] : '');
    const sep       = String(args[1] !== undefined ? args[1] : ',');
    const bodyNodes = args[2];

    if (!Array.isArray(bodyNodes)) return '';
    if (!list) return '';

    const items = list.split(sep);
    let output  = '';

    for (let i = 0; i < items.length; i++) {
      if (context.stopped) break;

      const iterCtx = context.child();
      iterCtx.variables.set('__foreach_value__',  items[i]);
      iterCtx.variables.set('__foreach_index__',  String(i));
      iterCtx.variables.set('__foreach_number__', String(i + 1));

      output += await iterCtx.executeNodes(bodyNodes);
      // iterCtx.stopped may be true here if $break or $continue fired —
      // but we intentionally do NOT propagate that to `context` so the
      // caller's execution continues normally after the forEach call.

      // $break — exit the loop entirely
      if (context.variables.get('__BREAK__')) {
        context.variables.delete('__BREAK__');
        break;
      }
      // $continue — clear flag and move to next item (stop already halted body)
      context.variables.delete('__CONTINUE__');
    }

    // Clean up loop variables
    context.variables.delete('__foreach_value__');
    context.variables.delete('__foreach_index__');
    context.variables.delete('__foreach_number__');

    return output;
  },
};
