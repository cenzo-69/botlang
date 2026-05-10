'use strict';

const MAX_DEPTH = 128;

/**
 * Execution context — the single object threaded through every function call.
 *
 * Fields:
 *   Discord          message, client
 *   Command parsing  commandName, commandInput, commandArgs, noMentionInput
 *   State            variables (shared Map), depth, stopped
 *   Loop             loopIndex (0-based), loopNumber (1-based), loopCount
 *   Debug            callStack (array of function names), functionName
 */
class Context {
  constructor({
    // Discord
    message,
    client,
    // Command parsing (populated by Runtime.runForCommand)
    commandName,
    commandInput,
    commandArgs,
    noMentionInput,
    // Execution state
    variables,
    depth,
    runtime,
    // Loop state
    loopIndex,
    loopNumber,
    loopCount,
    // Debug / call tracing
    callStack,
  } = {}) {
    // ── Discord ──────────────────────────────────────────────────────────────
    this.message = message || null;
    this.client  = client  || message?.client || null;

    // ── Command parsing context ───────────────────────────────────────────
    // commandInput   = everything after the command name  ("hello world")
    // commandArgs    = split array                        (["hello","world"])
    // noMentionInput = commandInput with mentions removed ("hello world")
    this.commandName    = commandName    || null;
    this.commandInput   = commandInput   || '';
    this.commandArgs    = commandArgs    || [];
    this.noMentionInput = noMentionInput || '';

    // ── Execution state ───────────────────────────────────────────────────
    this.variables = variables || new Map();   // shared across all child ctxs
    this.depth     = depth     || 0;
    this.runtime   = runtime   || null;
    this.stopped   = false;

    // ── Loop state (set by $loop; inherited by child contexts) ────────────
    this.loopIndex  = loopIndex  !== undefined ? loopIndex  : null;
    this.loopNumber = loopNumber !== undefined ? loopNumber : null;
    this.loopCount  = loopCount  !== undefined ? loopCount  : null;

    // ── Debug / call tracing ──────────────────────────────────────────────
    this.callStack    = callStack    || [];
    this.functionName = null;
  }

  // ── Child context ─────────────────────────────────────────────────────────
  // Creates a new Context inheriting all fields from this one.
  // The variables Map is SHARED (not cloned) so variable writes are visible
  // to the whole execution tree.
  child() {
    if (this.depth >= MAX_DEPTH) {
      const { FrameworkError } = require('./errors');
      throw new FrameworkError(
        'Maximum call depth exceeded — possible infinite recursion',
        this.functionName,
        this.callStack
      );
    }

    return new Context({
      message:         this.message,
      client:          this.client,
      commandName:     this.commandName,
      commandInput:    this.commandInput,
      commandArgs:     this.commandArgs,
      noMentionInput:  this.noMentionInput,
      variables:       this.variables,       // shared Map
      depth:           this.depth + 1,
      runtime:         this.runtime,
      loopIndex:       this.loopIndex,
      loopNumber:      this.loopNumber,
      loopCount:       this.loopCount,
      callStack:       [...this.callStack],  // snapshot for tracing
    });
  }

  // ── Node execution helper (used by lazy functions: $loop, $if, $onlyIf) ──
  async executeNodes(nodes) {
    return this.runtime.interpreter.executeNodes(nodes, this);
  }

  // ── Variable helpers ──────────────────────────────────────────────────────
  setVariable(name, value) {
    this.variables.set(String(name).toLowerCase(), String(value));
  }

  getVariable(name) {
    return this.variables.get(String(name).toLowerCase());
  }

  deleteVariable(name) {
    this.variables.delete(String(name).toLowerCase());
  }

  // ── Execution control ─────────────────────────────────────────────────────
  stop() {
    this.stopped = true;
  }

  // ── Formatted call stack (for error messages) ─────────────────────────────
  formatCallStack() {
    if (!this.callStack.length) return '(root)';
    return this.callStack.map(n => `$${n}`).join(' → ');
  }
}

module.exports = Context;
