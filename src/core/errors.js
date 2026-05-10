'use strict';

class FrameworkError extends Error {
  constructor(message, functionName = null, callStack = []) {
    super(message);
    this.name = 'FrameworkError';
    this.functionName = functionName;
    this.callStack    = callStack;
  }

  format() {
    let out = `[FrameworkError] ${this.message}`;
    if (this.functionName) out += ` (in $${this.functionName})`;
    if (this.callStack && this.callStack.length) {
      out += `\n  Call stack: ${this.callStack.map(n => `$${n}`).join(' → ')}`;
    }
    return out;
  }
}

class ParseError extends Error {
  constructor(message, pos = null) {
    super(message);
    this.name = 'ParseError';
    this.pos  = pos;
  }

  format() {
    let out = `[ParseError] ${this.message}`;
    if (this.pos !== null) out += ` (at position ${this.pos})`;
    return out;
  }
}

class RuntimeError extends Error {
  constructor(message, functionName = null, callStack = []) {
    super(message);
    this.name = 'RuntimeError';
    this.functionName = functionName;
    this.callStack    = callStack;
  }

  format() {
    let out = `[RuntimeError] ${this.message}`;
    if (this.functionName) out += ` (in $${this.functionName})`;
    if (this.callStack && this.callStack.length) {
      out += `\n  Call stack: ${this.callStack.map(n => `$${n}`).join(' → ')}`;
    }
    return out;
  }
}

module.exports = { FrameworkError, ParseError, RuntimeError };
