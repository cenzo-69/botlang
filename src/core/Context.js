'use strict';

const MAX_DEPTH = 128;

class Context {
  constructor({ message, client, variables, depth, runtime, loopIndex }) {
    this.message = message || null;
    this.client = client || message?.client || null;
    this.variables = variables || new Map();
    this.depth = depth || 0;
    this.runtime = runtime;
    this.loopIndex = loopIndex !== undefined ? loopIndex : null;
    this.stopped = false;
    this.functionName = null;
  }

  child() {
    if (this.depth >= MAX_DEPTH) {
      const { FrameworkError } = require('./errors');
      throw new FrameworkError('Maximum call depth exceeded (possible infinite recursion)', this.functionName);
    }
    return new Context({
      message: this.message,
      client: this.client,
      variables: this.variables,
      depth: this.depth + 1,
      runtime: this.runtime,
      loopIndex: this.loopIndex,
    });
  }

  async executeNodes(nodes) {
    return this.runtime.interpreter.executeNodes(nodes, this);
  }

  setVariable(name, value) {
    this.variables.set(String(name).toLowerCase(), value);
  }

  getVariable(name) {
    return this.variables.get(String(name).toLowerCase());
  }

  deleteVariable(name) {
    this.variables.delete(String(name).toLowerCase());
  }

  stop() {
    this.stopped = true;
  }
}

module.exports = Context;
