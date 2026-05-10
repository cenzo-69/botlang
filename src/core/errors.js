'use strict';

class FrameworkError extends Error {
  constructor(message, functionName = null) {
    super(message);
    this.name = 'FrameworkError';
    this.functionName = functionName;
  }
}

class ParseError extends Error {
  constructor(message, pos = null) {
    super(message);
    this.name = 'ParseError';
    this.pos = pos;
  }
}

class RuntimeError extends Error {
  constructor(message, functionName = null) {
    super(message);
    this.name = 'RuntimeError';
    this.functionName = functionName;
  }
}

module.exports = { FrameworkError, ParseError, RuntimeError };
