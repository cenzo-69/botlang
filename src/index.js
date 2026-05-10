'use strict';

const Runtime       = require('./core/Runtime');
const Parser        = require('./core/Parser');
const Interpreter   = require('./core/Interpreter');
const FunctionLoader = require('./core/FunctionLoader');
const Context       = require('./core/Context');
const { FrameworkError, ParseError, RuntimeError } = require('./core/errors');

module.exports = {
  // Primary API
  Runtime,

  // Core building blocks (for advanced use / extending)
  Parser,
  Interpreter,
  FunctionLoader,
  Context,

  // Error types
  FrameworkError,
  ParseError,
  RuntimeError,

  // Convenience: create a ready-to-use runtime instance
  createRuntime(options = {}) {
    return new Runtime(options);
  },
};
