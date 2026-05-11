'use strict';

const MAX_DEPTH = 128;

/**
 * Execution context — the single object threaded through every function call.
 *
 * Shared by reference across the whole execution tree (same as variables/embed):
 *   _out        — output-control container  { stopMessage: null | string }
 *   variables   — session variable Map
 *   embed       — embed builder state
 *   components  — Discord component state (buttons, select menus)
 *
 * Cloned per child:
 *   callStack   — for accurate per-branch tracing
 *
 * Incremented per child:
 *   depth       — recursion guard (max 128)
 */
class Context {
  constructor({
    // Discord
    message,
    client,
    // Command parsing
    commandName,
    commandInput,
    commandArgs,
    noMentionInput,
    // Execution state
    variables,
    depth,
    runtime,
    // Output control (shared object — $onlyIf stopMessage lives here)
    _out,
    // Embed state (shared object — mutated by $title, $color, etc.)
    embed,
    // Component state (shared array — $button, $selectMenu push here)
    components,
    // Loop state
    loopIndex,
    loopNumber,
    loopCount,
    // Debug / call tracing
    callStack,
  } = {}) {
    // ── Discord ───────────────────────────────────────────────────────────────
    this.message = message || null;
    this.client  = client  || message?.client || null;

    // ── Command parsing ───────────────────────────────────────────────────────
    this.commandName    = commandName    || null;
    this.commandInput   = commandInput   || '';
    this.commandArgs    = commandArgs    || [];
    this.noMentionInput = noMentionInput || '';

    // ── Execution state ───────────────────────────────────────────────────────
    this.variables = variables || new Map();
    this.depth     = depth     || 0;
    this.runtime   = runtime   || null;
    this.stopped   = false;

    // ── Output control (shared) ───────────────────────────────────────────────
    // $onlyIf[cond;errorMsg] stores errorMsg here; runForCommandFull checks it
    // after execution and uses it as the final text (replacing any accumulated
    // output), so only the error message is sent.
    this._out = _out || { stopMessage: null };

    // ── Embed state (shared) ──────────────────────────────────────────────────
    this.embed = embed || {
      title:       null,
      url:         null,
      description: null,
      color:       null,
      footer:      { text: null, iconURL: null },
      author:      { name: null, iconURL: null },
      thumbnail:   null,
      image:       null,
      timestamp:   null,
      fields:      [],
    };

    // ── Component state (shared) ──────────────────────────────────────────────
    // $button, $selectMenu etc. push descriptor objects here.
    // Runtime._buildComponents() converts them to ActionRowBuilders.
    this.components = components || [];

    // ── Loop state ────────────────────────────────────────────────────────────
    this.loopIndex  = loopIndex  !== undefined ? loopIndex  : null;
    this.loopNumber = loopNumber !== undefined ? loopNumber : null;
    this.loopCount  = loopCount  !== undefined ? loopCount  : null;

    // ── Debug / call tracing ──────────────────────────────────────────────────
    this.callStack    = callStack || [];
    this.functionName = null;
  }

  // ── Child context ──────────────────────────────────────────────────────────
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
      variables:       this.variables,    // shared Map
      _out:            this._out,         // shared output control
      embed:           this.embed,        // shared embed object
      components:      this.components,   // shared components array
      depth:           this.depth + 1,
      runtime:         this.runtime,
      loopIndex:       this.loopIndex,
      loopNumber:      this.loopNumber,
      loopCount:       this.loopCount,
      callStack:       [...this.callStack], // snapshot for tracing
    });
  }

  // ── Node execution helper ──────────────────────────────────────────────────
  async executeNodes(nodes) {
    return this.runtime.interpreter.executeNodes(nodes, this);
  }

  // ── Variable helpers ───────────────────────────────────────────────────────
  setVariable(name, value) {
    this.variables.set(String(name).toLowerCase(), String(value));
  }

  getVariable(name) {
    return this.variables.get(String(name).toLowerCase());
  }

  deleteVariable(name) {
    this.variables.delete(String(name).toLowerCase());
  }

  // ── Execution control ──────────────────────────────────────────────────────
  stop() {
    this.stopped = true;
  }

  // ── Formatted call stack ───────────────────────────────────────────────────
  formatCallStack() {
    if (!this.callStack.length) return '(root)';
    return this.callStack.map(n => `$${n}`).join(' → ');
  }
}

module.exports = Context;
