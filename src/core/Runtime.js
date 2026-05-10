'use strict';

const path           = require('path');
const Parser         = require('./Parser');
const Interpreter    = require('./Interpreter');
const FunctionLoader = require('./FunctionLoader');
const Context        = require('./Context');
const { ParseError, RuntimeError } = require('./errors');

// Mention patterns stripped by $noMentionMessage
const MENTION_RE = /<@!?\d+>|<#\d+>|<@&\d+>/g;

class Runtime {
  constructor(options = {}) {
    this.options = {
      maxExecutionTime:    options.maxExecutionTime    || 5000,
      unknownFunctionMode: options.unknownFunctionMode || 'passthrough',
    };

    this.loader = new FunctionLoader();
    this.loader.load(path.join(__dirname, '..', 'functions'));

    this.interpreter = new Interpreter(this.loader.functions);
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /** Register a custom function (or override an existing one) at runtime. */
  register(name, fn) {
    this.loader.register(name, fn);
    return this;
  }

  /** Load an additional directory of function files. */
  loadDir(dir) {
    this.loader.load(dir);
    return this;
  }

  /** Parse source → AST (synchronous, reusable). */
  parse(source) {
    try {
      return new Parser(source).parse();
    } catch (err) {
      if (err instanceof ParseError) throw err;
      throw new ParseError(err.message);
    }
  }

  /** Execute an already-parsed AST with an existing Context. */
  async executeAST(ast, context) {
    return this.interpreter.execute(ast, context);
  }

  // ── Core run pipeline ──────────────────────────────────────────────────────

  /**
   * Full pipeline: parse → build context → execute.
   *
   * Accepts the complete set of context options so that $eval can re-enter
   * the pipeline with the exact same execution scope (variables, command args,
   * etc.) instead of starting a fresh context.
   *
   * NOTE: $eval calls this directly — it does NOT use raw JS eval.
   */
  async run(source, options = {}) {
    const {
      message,
      client,
      variables,
      commandName,
      commandInput,
      commandArgs,
      noMentionInput,
    } = options;

    const ast = this.parse(source);

    const context = new Context({
      message,
      client:         client || message?.client,
      variables:      variables instanceof Map ? variables : new Map(),
      depth:          0,
      runtime:        this,
      commandName:    commandName    || null,
      commandInput:   commandInput   || '',
      commandArgs:    commandArgs    || [],
      noMentionInput: noMentionInput || '',
    });

    return this._withTimeout(
      this.interpreter.execute(ast, context),
      this.options.maxExecutionTime,
      'Execution timed out'
    );
  }

  // ── Convenience entrypoints ────────────────────────────────────────────────

  /**
   * Run a command triggered by a Discord message.
   * Parses command name + arguments from message.content automatically.
   *
   * This is the primary entry point for the bot's messageCreate handler.
   *
   * @param {string}  source  - The command code to execute
   * @param {Message} message - discord.js Message object
   * @param {string}  prefix  - Command prefix (default '!')
   */
  async runForCommand(source, message, prefix = '!') {
    const raw        = message.content.slice(prefix.length).trim();
    const parts      = raw.match(/\S+/g) || [];
    const cmdName    = parts[0] || '';
    const inputParts = parts.slice(1);
    const cmdInput   = inputParts.join(' ');

    return this.run(source, {
      message,
      commandName:    cmdName,
      commandInput:   cmdInput,
      commandArgs:    inputParts,
      noMentionInput: this._stripMentions(cmdInput),
    });
  }

  /**
   * Minimal runner — no command parsing.
   * Used for tests, inline embeds, and any case where message.content
   * does not follow the prefix+command format.
   */
  async runForMessage(source, message, extraVars = {}) {
    const variables = new Map(Object.entries(extraVars));
    return this.run(source, { message, variables });
  }

  // ── Internal helpers ───────────────────────────────────────────────────────

  _stripMentions(text) {
    return text
      .replace(MENTION_RE, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  _withTimeout(promise, ms, label) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new RuntimeError(label)), ms);
      promise.then(
        v => { clearTimeout(timer); resolve(v); },
        e => { clearTimeout(timer); reject(e);  }
      );
    });
  }
}

module.exports = Runtime;
