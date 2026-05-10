'use strict';

const path = require('path');
const Parser = require('./Parser');
const Interpreter = require('./Interpreter');
const FunctionLoader = require('./FunctionLoader');
const Context = require('./Context');
const { ParseError, RuntimeError } = require('./errors');

class Runtime {
  constructor(options = {}) {
    this.options = {
      maxExecutionTime: options.maxExecutionTime || 5000,
      unknownFunctionMode: options.unknownFunctionMode || 'passthrough', // 'passthrough' | 'error'
    };

    this.loader = new FunctionLoader();
    this.loader.load(path.join(__dirname, '..', 'functions'));

    this.interpreter = new Interpreter(this.loader.functions);
  }

  // Register a custom function at runtime
  register(name, fn) {
    this.loader.register(name, fn);
    return this;
  }

  // Load an additional directory of functions
  loadDir(dir) {
    this.loader.load(dir);
    return this;
  }

  // Parse source into an AST (synchronous)
  parse(source) {
    try {
      return new Parser(source).parse();
    } catch (err) {
      if (err instanceof ParseError) throw err;
      throw new ParseError(err.message);
    }
  }

  // Execute an already-parsed AST with a context
  async executeAST(ast, context) {
    return this.interpreter.execute(ast, context);
  }

  // Full pipeline: parse → execute
  async run(source, { message, client, variables } = {}) {
    const ast = this.parse(source);

    const context = new Context({
      message,
      client: client || message?.client,
      variables: variables instanceof Map ? variables : new Map(),
      depth: 0,
      runtime: this,
    });

    return this._withTimeout(
      this.interpreter.execute(ast, context),
      this.options.maxExecutionTime,
      'Execution timed out'
    );
  }

  // Convenience: parse + execute with a Discord.js message object
  async runForMessage(source, message, extraVars = {}) {
    const variables = new Map(Object.entries(extraVars));
    return this.run(source, { message, variables });
  }

  _withTimeout(promise, ms, label) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new RuntimeError(label)),
        ms
      );
      promise.then(
        v => { clearTimeout(timer); resolve(v); },
        e => { clearTimeout(timer); reject(e); }
      );
    });
  }
}

module.exports = Runtime;
