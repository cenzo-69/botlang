'use strict';

/**
 * Legacy compatibility shim.
 * The old API was: parse(code, message) => Promise<string>
 * This wraps the new Runtime to maintain backwards compatibility.
 */
const Runtime = require('./core/Runtime');

let _runtime = null;
function getRuntime() {
  if (!_runtime) _runtime = new Runtime();
  return _runtime;
}

async function parse(code, message) {
  return getRuntime().runForMessage(code, message);
}

module.exports = parse;
