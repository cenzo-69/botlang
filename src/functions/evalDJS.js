'use strict';

// $evalDJS is DISABLED by default.
//
// Raw JavaScript execution is intentionally blocked in user-facing commands.
// If you are a BOT DEVELOPER and need JS eval for debugging, manually opt in:
//
//   const { Runtime } = require('./src');
//   const runtime = new Runtime();
//   runtime.register('evalDJS', require('./src/dev/evalDJS'));
//
// Then restrict it to your owner ID inside the function or with $onlyIf.
module.exports = async () => '[evalDJS is disabled — see src/dev/evalDJS.js]';
